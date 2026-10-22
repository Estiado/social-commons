import { useEditorState, type Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

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
      className="sticky top-16 z-10 flex flex-wrap items-center gap-2 border-y bg-background/95 p-3 backdrop-blur"
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
      {actions.map(([label, active, run]) => (
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
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!state.undo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        撤销
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!state.redo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        重做
      </Button>
    </div>
  );
}
