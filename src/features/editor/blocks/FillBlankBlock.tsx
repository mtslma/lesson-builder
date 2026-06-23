import type { BlockFormProps, BlockPreviewProps, FillBlankBlock } from '../types/index';

export const FillBlankForm = ({ block, onUpdate }: BlockFormProps<FillBlankBlock>) => (
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
      value={block.text}
      onChange={(e) => onUpdate({ text: e.target.value })}
      placeholder="{{gap1}} you study English?"
    />
    <div className="space-y-2 rounded border bg-slate-50 p-2">
      {block.gaps.map((gap, index) => (
        <div key={gap.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
          <input
            type="text"
            className="rounded border p-1 text-xs font-mono"
            value={gap.id}
            onChange={(e) => {
              const nextGaps = [...block.gaps];
              nextGaps[index].id = e.target.value;
              onUpdate({ gaps: nextGaps });
            }}
            placeholder="gap1"
          />
          <input
            type="text"
            className="rounded border p-1 text-xs"
            value={gap.acceptedAnswers.join(', ')}
            onChange={(e) => {
              const nextGaps = [...block.gaps];
              nextGaps[index].acceptedAnswers = e.target.value
                .split(',')
                .map((answer) => answer.trim())
                .filter(Boolean);
              onUpdate({ gaps: nextGaps });
            }}
            placeholder="Accepted answers"
          />
          <label className="flex items-center gap-1 text-[10px]">
            <input
              type="checkbox"
              checked={gap.caseSensitive}
              onChange={(e) => {
                const nextGaps = [...block.gaps];
                nextGaps[index].caseSensitive = e.target.checked;
                onUpdate({ gaps: nextGaps });
              }}
            />
            Case
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onUpdate({
            gaps: [
              ...block.gaps,
              { id: `gap${block.gaps.length + 1}`, acceptedAnswers: [''], caseSensitive: false }
            ]
          })
        }
        className="text-xs font-bold text-blue-600"
      >
        + Add Gap
      </button>
    </div>
  </div>
);

export const FillBlankPreview = ({ block }: BlockPreviewProps<FillBlankBlock>) => (
  <div className="p-6 bg-slate-50 border-l-4 border-lime-500 rounded-r-xl my-6 shadow-sm">
    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 font-bold">
      {block.instruction || 'Fill the gaps'}
    </p>
    <div className="text-slate-800 text-sm font-serif leading-loose flex flex-wrap items-center gap-y-2">
      {block.text
        .split(/(\{\{[^}]+\}\})/g)
        .map((part: string, i: number) =>
          part.startsWith('{{') ? (
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
    {block.gaps.length > 0 && (
      <div className="mt-5 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Word Box:</span>
        {Array.from(new Set(block.gaps.flatMap((gap) => gap.acceptedAnswers))).map((sw: string, i: number) => (
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
