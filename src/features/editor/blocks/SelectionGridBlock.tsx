import React, { useState } from 'react';

export const SelectionGridForm: React.FC<any> = ({ block, onUpdate }) => {
  const addItem = () =>
    onUpdate({
      items: [...(block.items || []), { id: crypto.randomUUID(), text: '', isCorrect: false }]
    });
  const removeItem = (index: number) =>
    onUpdate({ items: block.items.filter((_: any, itemIndex: number) => itemIndex !== index) });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction..."
      />
      <label className="flex items-center gap-2 text-xs font-bold">
        <input
          type="checkbox"
          checked={block.isMultiSelect}
          onChange={(e) => onUpdate({ isMultiSelect: e.target.checked })}
        />{' '}
        Multi-select?
      </label>
      <div className="grid grid-cols-2 gap-2">
        {(block.items || []).map((it: any, i: number) => (
          <div key={it.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>
            <input type="text" className="w-full p-1 border rounded text-xs" value={it.text} onChange={(e) => {
              const n = [...block.items];
              n[i].text = e.target.value;
              onUpdate({ items: n });
            }} placeholder="Text" />
            <input type="text" className="w-full p-1 border rounded text-xs" value={it.imageUrl || ''} onChange={(e) => {
              const n = [...block.items];
              n[i].imageUrl = e.target.value;
              onUpdate({ items: n });
            }} placeholder="Img URL" />
            <label className="flex items-center gap-1 text-[10px]">
              <input type="checkbox" checked={!!it.isCorrect} onChange={(e) => {
                const n = [...block.items];
                n[i].isCorrect = e.target.checked;
                onUpdate({ items: n });
              }} /> Correct?
            </label>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">
        + Add Option
      </button>
    </div>
  );
};

export const SelectionGridPreview: React.FC<any> = ({ block }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleItem = (itemId: string) =>
    setSelectedIds((prev) =>
      block.isMultiSelect
        ? prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        : prev.includes(itemId) ? [] : [itemId]
    );
  return (
    <div className="my-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
      <p className="text-[10px] font-bold text-slate-400 font-mono uppercase border-b pb-2">
        Check and Say: {block.instruction}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {block.items.map((it: any) => {
          const selected = selectedIds.includes(it.id);
          return (
            <button key={it.id} onClick={() => toggleItem(it.id)} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selected ? 'border-lime-500 bg-lime-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
              {selected && <div className="absolute -top-2 -right-2 w-5 h-5 bg-lime-500 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">OK</div>}
              {it.imageUrl && <img src={it.imageUrl} alt="" className="w-12 h-12 mb-2 rounded-full object-cover shadow-xs border" />}
              <span className="text-sm font-bold font-sans text-slate-700">{it.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
