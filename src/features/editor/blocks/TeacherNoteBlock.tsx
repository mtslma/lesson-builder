import type { BlockFormProps, BlockPreviewProps, TeacherNoteBlock } from '../types/index';

export const TeacherNoteForm = ({ block, onUpdate }: BlockFormProps<TeacherNoteBlock>) => (
  <div className="space-y-2">
    <input
      type="text"
      className="font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Note title"
    />
    <textarea
      className="min-h-24"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder="Tip or guidance for the student"
    />
  </div>
);

export const TeacherNotePreview = ({ block }: BlockPreviewProps<TeacherNoteBlock>) => (
  <div className="editor-note-panel my-6">
    <div className="editor-note-header">
      <span className="editor-note-icon" aria-hidden="true">
        !
      </span>
      <div>
        <div className="editor-note-eyebrow">Student Tip</div>
        <h3 className="editor-note-title text-base font-semibold">{block.title}</h3>
      </div>
    </div>
    <p className="mt-2 text-sm leading-6 text-slate-700">{block.content}</p>
  </div>
);
