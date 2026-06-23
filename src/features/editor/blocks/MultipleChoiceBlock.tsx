import type { BlockFormProps, BlockPreviewProps, MultipleChoiceBlock } from '../types/index';

export const MultipleChoiceForm = ({ block, onUpdate }: BlockFormProps<MultipleChoiceBlock>) => {
  const addOption = () =>
    onUpdate({ options: [...(block.options || []), { id: crypto.randomUUID(), text: '', isCorrect: false }] });
  const removeOption = (index: number) =>
    onUpdate({ options: block.options.filter((_, optionIndex) => optionIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.question} onChange={(e) => onUpdate({ question: e.target.value })} placeholder="Question..." />
      <div className="space-y-1">
        {(block.options || []).map((o, i) => (
          <div key={o.id} className="flex items-center gap-2 border p-1 rounded bg-slate-50">
            <input type="checkbox" checked={!!o.isCorrect} onChange={(e) => {
              const n = [...block.options];
              n[i].isCorrect = e.target.checked;
              onUpdate({ options: n });
            }} />
            <input type="text" className="flex-1 p-1 text-xs border rounded" value={o.text} onChange={(e) => {
              const n = [...block.options];
              n[i].text = e.target.value;
              onUpdate({ options: n });
            }} placeholder="Option text" />
            <button type="button" onClick={() => removeOption(i)} className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="text-xs text-blue-600 font-bold">+ Add Option</button>
    </div>
  );
};

export const MultipleChoicePreview = ({ block }: BlockPreviewProps<MultipleChoiceBlock>) => (
  <div className="my-6 p-5 border bg-slate-50 rounded-2xl shadow-sm space-y-3">
    <p className="text-sm font-bold text-slate-800 font-serif">{block.question}</p>
    <div className="space-y-2">
      {block.options.map((o) => (
        <label key={o.id} className="flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-lime-400">
          <input type="radio" name={block.id} className="w-4 h-4 text-lime-600" />
          <span className="text-sm font-medium text-slate-700">{o.text}</span>
        </label>
      ))}
    </div>
  </div>
);
