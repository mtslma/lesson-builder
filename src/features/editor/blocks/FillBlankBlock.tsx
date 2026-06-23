import React from 'react';

export const FillBlankForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.instruction || ''}
      onChange={(e) => onUpdate({ instruction: e.target.value })}
      placeholder="Instruction"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-20"
      value={block.textWithGaps}
      onChange={(e) => onUpdate({ textWithGaps: e.target.value })}
      placeholder="Hello, I [am] happy."
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={(block.supportWords || []).join(', ')}
      onChange={(e) =>
        onUpdate({
          supportWords: e.target.value
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        })
      }
      placeholder="Word Box (comma separated)"
    />
  </div>
);

export const FillBlankPreview: React.FC<any> = ({ block }) => (
  <div className="p-6 bg-slate-50 border-l-4 border-lime-500 rounded-r-xl my-6 shadow-sm">
    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 font-bold">
      {block.instruction || 'Fill the gaps'}
    </p>
    <div className="text-slate-800 text-sm font-serif leading-loose flex flex-wrap items-center gap-y-2">
      {block.textWithGaps
        .split(/(\[[^\]]+\])/g)
        .map((part: string, i: number) =>
          part.startsWith('[') ? (
            <input
              key={i}
              type="text"
              style={{ width: `${Math.max(part.length, 5)}ch` }}
              className="mx-1 px-2 py-0.5 border-b-2 border-slate-300 font-sans font-bold text-center text-lime-700 focus:border-lime-500 outline-none rounded-t-md bg-white shadow-xs"
              placeholder="..."
            />
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </div>
    {block.supportWords && block.supportWords.length > 0 && (
      <div className="mt-5 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Word Box:</span>
        {block.supportWords.map((sw: string, i: number) => (
          <span
            key={i}
            className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-semibold shadow-2xs"
          >
            {sw}
          </span>
        ))}
      </div>
    )}
  </div>
);
