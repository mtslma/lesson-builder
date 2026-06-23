import React, { useState } from 'react';

export const GrammarNoteForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Note Title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm"
      value={block.ruleContext}
      onChange={(e) => onUpdate({ ruleContext: e.target.value })}
      placeholder="Main grammar rule explanation..."
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.expandableTitle}
      onChange={(e) => onUpdate({ expandableTitle: e.target.value })}
      placeholder="Expandable Button Text (e.g. See Examples)"
    />
    <textarea
      className="w-full p-2 border rounded text-sm"
      value={block.expandableContent}
      onChange={(e) => onUpdate({ expandableContent: e.target.value })}
      placeholder="Expanded content..."
    />
  </div>
);

export const GrammarNotePreview: React.FC<any> = ({ block }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="my-6 rounded-xl border border-blue-200 bg-blue-50/40 overflow-hidden shadow-sm">
      <div className="p-5 flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black font-serif shrink-0">
          !
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {block.title}
          </h3>
          <p className="text-sm text-slate-700 font-serif mt-1">{block.ruleContext}</p>
        </div>
      </div>
      <div className="border-t border-blue-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-white/60 text-xs font-bold text-blue-600 flex justify-between"
        >
          <span>{block.expandableTitle}</span>
          <span>▼</span>
        </button>
        {isExpanded && (
          <div className="p-5 bg-white text-sm text-slate-600 font-serif whitespace-pre-wrap">
            {block.expandableContent}
          </div>
        )}
      </div>
    </div>
  );
};
