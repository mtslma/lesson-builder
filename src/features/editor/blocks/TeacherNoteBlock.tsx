import React from 'react';

export const TeacherNoteForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Note title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-24"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder="Tip or guidance for the student"
    />
  </div>
);

export const TeacherNotePreview: React.FC<any> = ({ block }) => (
  <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
      Student Tip
    </div>
    <h3 className="mt-2 text-base font-semibold text-amber-950">{block.title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-700">{block.content}</p>
  </div>
);
