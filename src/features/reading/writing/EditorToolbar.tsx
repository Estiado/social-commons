import { useEditorState, type Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Bold, Underline } from 'lucide-react';

export function EditorToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      bullet: editor.isActive('bulletList'),
      numbered: editor.isActive('orderedList'),
      quote: editor.isActive('blockquote'),
      level: [1, 2, 3, 4].find((level) => editor.isActive('heading', { level })) || 0,
      alignment:
        editor.getAttributes('paragraph').textAlign ||
        editor.getAttributes('heading').textAlign ||
        'left',
      undo: editor.can().undo(),
      redo: editor.can().redo(),
    }),
  });
  const actions = [
    ['加粗', state.bold, () => editor.chain().focus().toggleBold().run()],
    ['斜体', state.italic, () => editor.chain().focus().toggleItalic().run()],
    ['下划线', state.underline, () => editor.chain().focus().toggleUnderline().run()],
    ['删除线', state.strike, () => editor.chain().focus().toggleStrike().run()],
    ['项目列表', state.bullet, () => editor.chain().focus().toggleBulletList().run()],
    ['编号列表', state.numbered, () => editor.chain().focus().toggleOrderedList().run()],
    ['引用', state.quote, () => editor.chain().focus().toggleBlockquote().run()],
  ] as const;
  return (
    <div
      role="toolbar"
      aria-label="文稿格式"
      className="sticky top-16 z-10 flex flex-wrap items-center gap-1 border-y bg-background/95 py-2 backdrop-blur"
    >
      <select
        aria-label="段落样式"
        className="rounded-sm border bg-background p-2 text-sm"
        value={state.level}
        onChange={(event) => {
          const level = Number(event.target.value) as 1 | 2 | 3 | 4;
          if (level) editor.chain().focus().setHeading({ level }).run();
          else editor.chain().focus().setParagraph().run();
        }}
      >
        <option value="0">正文</option>
        {[1, 2, 3, 4].map((level) => (
          <option key={level} value={level}>
            标题 {level}
          </option>
        ))}
      </select>
      {actions
        .filter(([label]) => ['加粗', '下划线'].includes(label))
        .map(([label, active, run]) => (
          <Button
            key={label}
            type="button"
            size="sm"
            aria-pressed={active}
            aria-label={label}
            title={label}
            className="h-9 w-9 px-0"
            variant={active ? 'default' : 'outline'}
            onMouseDown={(event) => event.preventDefault()}
            onClick={run}
          >
            {label === '加粗' ? <Bold className="h-4 w-4" /> : <Underline className="h-4 w-4" />}
          </Button>
        ))}
      <details className="relative">
        <summary className="cursor-pointer rounded-sm border px-2 py-2 text-sm">更多</summary>
        <div className="absolute right-0 z-20 mt-2 flex w-64 flex-wrap gap-2 rounded-sm border bg-background p-3 shadow-md">
          {actions
            .filter(([label]) => !['加粗', '下划线'].includes(label))
            .map(([label, active, run]) => (
              <Button
                key={label}
                type="button"
                size="sm"
                aria-pressed={active}
                variant={active ? 'default' : 'outline'}
                onMouseDown={(event) => event.preventDefault()}
                onClick={run}
              >
                {label}
              </Button>
            ))}
          <select
            aria-label="文字对齐"
            className="rounded-sm border bg-background p-2 text-sm"
            value={state.alignment}
            onChange={(event) => editor.chain().focus().setTextAlign(event.target.value).run()}
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </div>
      </details>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-label="撤销"
        title="撤销"
        className="h-9 w-9 px-0"
        disabled={!state.undo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-label="重做"
        title="重做"
        className="h-9 w-9 px-0"
        disabled={!state.redo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
