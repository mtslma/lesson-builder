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

export const HeadingPreview: React.FC<any> = ({ block }) => (
  <h2 className="text-2xl font-serif font-black text-slate-950 tracking-tight mt-10 mb-4 border-b-2 border-slate-100 pb-2">
    {block.content}
  </h2>
);
