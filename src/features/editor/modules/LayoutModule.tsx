import React from 'react';

export const HeadingForm: React.FC<any> = ({ block, onUpdate }) => (
  <input
    type="text"
    className="w-full text-lg font-bold border-b border-slate-200 outline-none pb-1 bg-transparent"
    value={block.content}
    onChange={(e) => onUpdate({ content: e.target.value })}
    placeholder="Heading text..."
  />
);
export const ParagraphForm: React.FC<any> = ({ block, onUpdate }) => (
  <textarea
    className="w-full p-2 border border-slate-200 rounded text-sm min-h-[80px]"
    value={block.content}
    onChange={(e) => onUpdate({ content: e.target.value })}
    placeholder="Paragraph text..."
  />
);

export const HeadingPreview: React.FC<any> = ({ block }) => (
  <h2 className="text-2xl font-serif font-black text-slate-950 tracking-tight mt-10 mb-4 border-b-2 border-slate-100 pb-2">
    {block.content}
  </h2>
);
export const ParagraphPreview: React.FC<any> = ({ block }) => (
  <p className="text-base text-slate-700 leading-relaxed font-serif my-4">{block.content}</p>
);
