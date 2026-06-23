import React from 'react';

export const ImageNumberingForm: React.FC<any> = ({ block, onUpdate }) => {
  const addItem = () =>
    onUpdate({
      items: [...(block.items || []), { id: crypto.randomUUID(), imageUrl: '', correctNumber: 1, label: '' }]
    });
  const removeItem = (index: number) =>
    onUpdate({ items: block.items.filter((_: any, itemIndex: number) => itemIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Title" />
      <div className="grid grid-cols-2 gap-2">
        {(block.items || []).map((it: any, i: number) => (
          <div key={it.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <div className="flex justify-end"><button type="button" onClick={() => removeItem(i)} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button></div>
            <input type="text" className="w-full p-1 border rounded text-xs" value={it.imageUrl} onChange={(e) => {
              const n = [...block.items];
              n[i].imageUrl = e.target.value;
              onUpdate({ items: n });
            }} placeholder="Image URL" />
            <input type="text" className="w-full p-1 border rounded text-xs" value={it.label} onChange={(e) => {
              const n = [...block.items];
              n[i].label = e.target.value;
              onUpdate({ items: n });
            }} placeholder="Label" />
            <input type="number" className="w-full p-1 border rounded text-xs" value={it.correctNumber} onChange={(e) => {
              const n = [...block.items];
              n[i].correctNumber = Number(e.target.value);
              onUpdate({ items: n });
            }} />
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">+ Add Image</button>
    </div>
  );
};

export const ImageNumberingPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border rounded-2xl bg-white shadow-sm space-y-5">
    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase border-b pb-2 block">{block.title}</span>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Routine List</div>
        <div className="mt-3 space-y-2">
          {block.items.map((it: any) => (
            <div key={it.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">{it.correctNumber}</span>
              <span className="text-sm font-medium text-slate-700">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {block.items.map((it: any, i: number) => (
          <div key={i} className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border relative">
            <input type="text" maxLength={2} className="absolute top-2 left-2 w-8 h-8 border-2 border-slate-300 text-center rounded-lg bg-white text-xs font-bold outline-none text-lime-600 focus:border-lime-500 shadow-xs" placeholder="#" />
            <img src={it.imageUrl} alt="" className="w-full h-28 object-cover rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
