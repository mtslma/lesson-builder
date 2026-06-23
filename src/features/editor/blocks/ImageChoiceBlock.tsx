import React from 'react';

export const ImageChoiceForm: React.FC<any> = ({ block, onUpdate }) => {
  const addOption = () =>
    onUpdate({ options: [...(block.options || []), { id: crypto.randomUUID(), text: '', imageUrl: '' }] });
  const removeOption = (index: number) =>
    onUpdate({ options: block.options.filter((_: any, optionIndex: number) => optionIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.question} onChange={(e) => onUpdate({ question: e.target.value })} placeholder="Question..." />
      <div className="grid grid-cols-2 gap-2">
        {(block.options || []).map((opt: any, i: number) => (
          <div key={opt.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <div className="flex justify-end"><button type="button" onClick={() => removeOption(i)} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button></div>
            <input type="text" className="w-full p-1 border rounded text-xs" value={opt.text} onChange={(e) => {
              const n = [...block.options];
              n[i].text = e.target.value;
              onUpdate({ options: n });
            }} placeholder="Text" />
            <input type="text" className="w-full p-1 border rounded text-xs" value={opt.imageUrl || ''} onChange={(e) => {
              const n = [...block.options];
              n[i].imageUrl = e.target.value;
              onUpdate({ options: n });
            }} placeholder="Img URL" />
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="text-xs text-blue-600 font-bold">+ Add Option</button>
    </div>
  );
};

export const ImageChoicePreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 bg-white border rounded-2xl shadow-sm space-y-4">
    <p className="text-sm font-bold text-slate-800 font-serif">{block.question}</p>
    <div className="grid grid-cols-2 gap-3">
      {block.options.map((opt: any) => (
        <div key={opt.id} className="flex flex-col items-center p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-colors">
          {opt.imageUrl && <img src={opt.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
          <span className="text-xs font-bold text-slate-700">{opt.text}</span>
        </div>
      ))}
    </div>
  </div>
);
