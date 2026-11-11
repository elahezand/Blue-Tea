"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichEditorProps {
    value: string
    onChange: (html: string) => void
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    if (!editor) return null;

    return (
        <>
            <div className="mb-3 flex flex-wrap gap-1.5" role="toolbar" aria-label="Text formatting">
                {([["B", "toggleBold", "bold", "Bold"], ["I", "toggleItalic", "italic", "Italic"], ["S", "toggleStrike", "strike", "Strikethrough"], ["List", "toggleBulletList", "bulletList", "Bullet list"]] as const).map(([label, cmd, name, aria]) => (
                    <button key={name} type="button" aria-label={aria} aria-pressed={editor.isActive(name)}
                        onClick={() => editor.chain().focus()[cmd]().run()}
                        className={`h-8 min-w-8 cursor-pointer rounded-full border border-solid px-3 text-sm font-medium transition-colors ${editor.isActive(name) ? "border-transparent bg-[var(--navy)] text-[var(--cream)]" : "border-line bg-surface text-fg hover:bg-soft"}`}>
                        {label}
                    </button>
                ))}
            </div>
            <EditorContent editor={editor} className="richEditor" />
        </>
    )
}
