import React, { useState } from 'react';

export const VocabularyMatchForm: React.FC<any> = ({ block, onUpdate }) => {
  const addPair = () => onUpdate({ pairs: [...block.pairs, { left: '', leftType: 'text', right: '' }] });
  const removePair = (index: number) => onUpdate({ pairs: block.pairs.filter((_: any, pairIndex: number) => pairIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Title..." />
      {(block.pairs || []).map((p: any, i: number) => (
        <div key={i} className="flex gap-1 border p-1 rounded bg-slate-50">
          <select className="text-xs border rounded" value={p.leftType} onChange={(e) => {
            const n = [...block.pairs];
            n[i].leftType = e.target.value;
            onUpdate({ pairs: n });
          }}>
            <option value="text">TXT</option>
            <option value="image">IMG</option>
          </select>
          <input type="text" className="flex-1 p-1 border rounded text-xs" value={p.left} onChange={(e) => {
            const n = [...block.pairs];
            n[i].left = e.target.value;
            onUpdate({ pairs: n });
          }} placeholder="Left" />
          <input type="text" className="flex-1 p-1 border rounded text-xs" value={p.right} onChange={(e) => {
            const n = [...block.pairs];
            n[i].right = e.target.value;
            onUpdate({ pairs: n });
          }} placeholder="Right" />
          <button type="button" onClick={() => removePair(i)} className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addPair} className="text-xs text-blue-600 font-bold">+ Add Pair</button>
    </div>
  );
};

export const VocabularyMatchPreview: React.FC<any> = ({ block }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [rightItems] = useState(() => [...block.pairs].map((pair: any) => pair.right).sort(() => Math.random() - 0.5));
  const handleRightClick = (right: string) => {
    if (!selectedLeft) return;
    setMatchedPairs((prev) => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
  };
  return (
    <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Connect: {block.title}</span>
        <span className="text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded">{Object.keys(matchedPairs).length} / {block.pairs.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {block.pairs.map((p: any, i: number) => {
            const matched = !!matchedPairs[p.left];
            const selected = selectedLeft === p.left;
            return (
              <div key={i} onClick={() => !matched && setSelectedLeft(p.left)} className={`relative border rounded-xl p-3 flex items-center justify-center min-h-[58px] cursor-pointer transition-all ${matched ? 'bg-slate-200 opacity-50 border-slate-300' : selected ? 'bg-lime-100 border-lime-500 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                {p.leftType === 'image' ? <img src={p.left} className="h-14 rounded object-contain" alt="" /> : <span className="text-sm font-bold">{p.left}</span>}
                {matched && <span className="absolute right-3 text-lime-500 font-bold">✓</span>}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {rightItems.map((right: string, i: number) => {
            const matched = Object.values(matchedPairs).includes(right);
            return (
              <div key={i} onClick={() => handleRightClick(right)} className={`border-2 border-dashed rounded-xl p-3 flex items-center justify-center min-h-[58px] cursor-pointer transition-all ${matched ? 'bg-lime-50 border-lime-300 text-lime-700' : selectedLeft ? 'bg-white border-lime-400 hover:bg-lime-50' : 'border-slate-300 bg-white'}`}>
                <span className="text-sm font-bold">{right}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
