import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { mergeAttributes, type JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { articleImageUrl } from '../export/assets';
import { documentToEditor, editorToDocument } from './editorDocument';
import type { WritingDraft } from './model';
import { saveDraft } from './repository';
import { EditorToolbar } from './EditorToolbar';
import { DocumentStyleControls } from './DocumentStyleControls';
import { DEFAULT_TYPOGRAPHY, DOCUMENT_FONTS, type DocumentTypography } from '../typography';
import './writing.css';
import { firstSearchMatch } from '../searchIndex';

const ReadingImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const value =
            element.getAttribute('data-original-src') || element.getAttribute('src') || '';
          return /^https?:\/\//i.test(value) ? value : null;
        },
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        src: /^https?:\/\//i.test(node.attrs.src || '') ? articleImageUrl(node.attrs.src) : '',
        'data-original-src': node.attrs.src,
      }),
    ];
  },
});

/** Only this component owns the mutable editor. Typing does not rerender the library. */
export function WritingEditor({ initial }: { initial: WritingDraft }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery =
    typeof location.state?.readingQuery === 'string'
      ? location.state.readingQuery.slice(0, 200)
      : '';
  const [initialContent] = useState(() => documentToEditor(initial.document));
  const saved = useRef(initial);
  const titleRef = useRef(initial.document.title);
  const content = useRef<JSONContent>(initialContent);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef(Promise.resolve());
  const generation = useRef(0);
  const savedGeneration = useRef(0);
  const blocked = useRef(false);
  const active = useRef(true);
  const [title, setTitle] = useState(initial.document.title);
  const [typography, setTypography] = useState<DocumentTypography>(
    initial.document.typography || DEFAULT_TYPOGRAPHY,
  );
  const typographyRef = useRef(typography);
  const [status, setStatus] = useState('已保存在当前浏览器');
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState(false);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    queue.current = queue.current.then(async () => {
      if (generation.current === savedGeneration.current || blocked.current) return;
      const writingGeneration = generation.current;
      try {
        const document = editorToDocument(
          content.current,
          { ...saved.current.document, typography: typographyRef.current },
          titleRef.current,
        );
        saved.current = await saveDraft({ ...saved.current, document });
        savedGeneration.current = writingGeneration;
        if (active.current) setStatus('已保存在当前浏览器');
      } catch (error) {
        // Keep unsaved editor contents available for download on conflicts or quota failure.
        blocked.current = true;
        if (active.current) {
          setStatus('尚未保存，请先下载当前文稿备份');
          setNotice(error instanceof Error ? error.message : '文稿保存失败');
        }
      }
    });
    return queue.current;
  }, []);
  const changed = useCallback(() => {
    generation.current += 1;
    setStatus(blocked.current ? '尚未保存，请先下载当前文稿备份' : '正在保存…');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush();
    }, 650);
  }, [flush]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: false, protocols: ['http', 'https'] },
      }),
      ReadingImage.configure({ allowBase64: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-label': '文稿正文',
        'aria-multiline': 'true',
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor }) => {
      content.current = editor.getJSON();
      changed();
    },
  });
  useEffect(() => {
    active.current = true;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (generation.current > savedGeneration.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      active.current = false;
      clearTimeout(timer.current);
      void flush();
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [flush]);
  useEffect(() => {
    if (!editor || !searchQuery) return;
    let found = false;
    editor.state.doc.descendants((node, position) => {
      if (found || !node.isTextblock) return !found;
      const match = firstSearchMatch(node.textContent, searchQuery);
      if (match) {
        found = true;
        editor
          .chain()
          .focus(undefined, { scrollIntoView: false })
          .setTextSelection({ from: position + 1 + match.start, to: position + 1 + match.end })
          .scrollIntoView()
          .run();
      }
      return !found;
    });
  }, [editor, searchQuery]);
  const exportFile = async (format: 'docx' | 'pdf') => {
    setExporting(true);
    setNotice('');
    try {
      // Export reads the live snapshot, including edits made within the debounce window.
      const document = editorToDocument(
        content.current,
        { ...saved.current.document, typography: typographyRef.current },
        titleRef.current,
      );
      const { exportArticle } = await import('../export/articleExport');
      const warnings = await exportArticle(document, format);
      setNotice(warnings.length ? warnings.join('；') : '已生成一份包含当前文稿内容的文件');
      await flush();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '导出失败');
    } finally {
      setExporting(false);
    }
  };
  const leave = async (selectMore = false) => {
    await flush();
    if (blocked.current) {
      setNotice('请先下载当前内容备份；保存异常解决前暂不离开编辑器。');
      return;
    }
    navigate(selectMore ? `/reading?append=${initial.document.id}` : '/reading');
  };
  return (
    <div className="writing-editor mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => void leave()}>
          返回阅读空间
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void leave(true)}>
            继续选材
          </Button>
          <Button disabled={exporting} onClick={() => void exportFile('docx')}>
            下载 Word
          </Button>
          <Button variant="outline" disabled={exporting} onClick={() => void exportFile('pdf')}>
            下载 PDF
          </Button>
        </div>
      </div>
      <h1 className="sr-only">编辑文稿</h1>
      <Input
        aria-label="文稿标题"
        maxLength={500}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          titleRef.current = event.target.value;
          changed();
        }}
        className="mb-3 h-auto py-3 font-serif text-xl"
      />
      <p role="status" className="mb-4 text-xs text-muted-foreground">
        {status}
      </p>
      {notice && (
        <p role="status" className="mb-4 rounded-sm border border-accent/30 p-3 text-sm">
          {notice}
        </p>
      )}
      <details className="mb-4 rounded-sm border px-3 py-2">
        <summary className="cursor-pointer text-sm">排版设置</summary>
        <DocumentStyleControls
          value={typography}
          onChange={(value) => {
            typographyRef.current = value;
            setTypography(value);
            changed();
          }}
        />
      </details>
      {editor && <EditorToolbar editor={editor} />}
      <div
        className="mt-5 border bg-card px-5 py-8 shadow-sm md:px-14 md:py-12"
        style={{
          fontFamily: DOCUMENT_FONTS[typography.font].css,
          fontSize: `${typography.size}pt`,
          lineHeight: typography.lineHeight,
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        可直接输入、粘贴、删除或移动文字。文稿只保存在此浏览器，清理数据前请下载备份。
      </p>
    </div>
  );
}
