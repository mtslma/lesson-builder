import React from 'react';

export const RewriteQuestionForm: React.FC<any> = ({ block, onUpdate }) => {
  const addExample = () => onUpdate({ examples: [...(block.examples || []), { input: '', output: '' }] });
  const addItem = () => onUpdate({ items: [...(block.items || []), ''] });
  const removeExample = (index: number) =>
    onUpdate({ examples: block.examples.filter((_: any, exampleIndex: number) => exampleIndex !== index) });
  const removeItem = (index: number) =>
    onUpdate({ items: block.items.filter((_: any, itemIndex: number) => itemIndex !== index) });
  return (
    <div className="space-y-3">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
      <div className="border p-2 rounded bg-slate-50 space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">Examples</span>
        {(block.examples || []).map((ex: any, i: number) => (
          <div key={i} className="flex gap-2">
            <input type="text" className="flex-1 p-1 text-xs border rounded" value={ex.input} onChange={(e) => {
              const n = [...block.examples!];
              n[i].input = e.target.value;
              onUpdate({ examples: n });
            }} placeholder="Input" />
            <input type="text" className="flex-1 p-1 text-xs border rounded text-lime-700 bg-lime-50" value={ex.output} onChange={(e) => {
              const n = [...block.examples!];
              n[i].output = e.target.value;
              onUpdate({ examples: n });
            }} placeholder="Output" />
            <button type="button" onClick={() => removeExample(i)} className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addExample} className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">+ Add Example</button>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">Items</span>
        {(block.items || []).map((it: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input type="text" className="w-full p-1.5 text-xs border rounded" value={it} onChange={(e) => {
              const n = [...block.items];
              n[i] = e.target.value;
              onUpdate({ items: n });
            }} />
            <button type="button" onClick={() => removeItem(i)} className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">+ Add Item</button>
      </div>
    </div>
  );
};

export const RewriteQuestionPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border rounded-2xl shadow-sm space-y-4 bg-white">
    <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest border-b pb-2">{block.instruction}</p>
    {block.examples?.map((ex: any, i: number) => (
      <div key={i} className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 border">
        <span className="font-bold text-slate-800 mr-2">Ex:</span>
        {ex.input} <span className="text-lime-600 font-bold mx-2">→</span> {ex.output}
      </div>
    ))}
    <div className="space-y-3 pt-2">
      {block.items.map((it: string, i: number) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">{i + 1}. {it}</span>
          <input type="text" className="w-full p-2 border rounded-lg outline-none focus:border-lime-500 text-sm font-sans" placeholder="Rewrite here..." />
        </div>
      ))}
    </div>
  </div>
);
