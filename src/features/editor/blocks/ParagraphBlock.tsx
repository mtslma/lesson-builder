import React from 'react';

export const ParagraphForm: React.FC<any> = ({ block, onUpdate }) => (
  <textarea
    className="w-full p-2 border border-slate-200 rounded text-sm min-h-[80px]"
    value={block.content}
    onChange={(e) => onUpdate({ content: e.target.value })}
    placeholder="Paragraph text..."
  />
);

export const ParagraphPreview: React.FC<any> = ({ block }) => (
  <p className="text-base text-slate-700 leading-relaxed font-serif my-4">{block.content}</p>
);
