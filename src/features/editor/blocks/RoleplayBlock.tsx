import React from 'react';

export const RoleplayForm: React.FC<any> = ({ block, onUpdate }) => {
  const addChar = () => onUpdate({ characters: [...(block.characters || []), { name: '' }] });
  const removeChar = (index: number) => onUpdate({ characters: block.characters.filter((_: any, charIndex: number) => charIndex !== index) });
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase block text-slate-500">Characters</span>
        {(block.characters || []).map((c: any, i: number) => (
          <div key={i} className="border p-2 rounded bg-slate-50 space-y-1">
            <div className="flex justify-end"><button type="button" onClick={() => removeChar(i)} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button></div>
            <input type="text" className="w-full p-1 text-xs border rounded font-bold" value={c.name} onChange={(e) => {
              const n = [...block.characters];
              n[i].name = e.target.value;
              onUpdate({ characters: n });
            }} placeholder="Character Name" />
            <div className="flex gap-1">
              <input type="text" className="flex-1 p-1 text-xs border rounded" value={c.country || ''} onChange={(e) => {
                const n = [...block.characters];
                n[i].country = e.target.value;
                onUpdate({ characters: n });
              }} placeholder="Country" />
              <input type="text" className="flex-1 p-1 text-xs border rounded" value={c.city || ''} onChange={(e) => {
                const n = [...block.characters];
                n[i].city = e.target.value;
                onUpdate({ characters: n });
              }} placeholder="City" />
            </div>
            <input type="text" className="w-full p-1 text-xs border rounded" value={c.activity || ''} onChange={(e) => {
              const n = [...block.characters];
              n[i].activity = e.target.value;
              onUpdate({ characters: n });
            }} placeholder="Activity" />
          </div>
        ))}
        <button type="button" onClick={addChar} className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">+ Add Character</button>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase block text-slate-500">Prompts</span>
        <textarea className="w-full p-2 border rounded text-sm h-16" value={(block.prompts || []).join('\n')} onChange={(e) => onUpdate({ prompts: e.target.value.split('\n').filter(Boolean) })} placeholder="Prompts (One per line)" />
      </div>
    </div>
  );
};

export const RoleplayPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 p-6 bg-indigo-50/50 border border-indigo-200 rounded-2xl shadow-sm space-y-5">
    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-mono block mb-2">🎭 Roleplay Cards</span>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {block.characters.map((c: any, i: number) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs space-y-1">
          <p className="font-bold text-slate-900">{c.name}</p>
          {c.country && <p className="text-xs text-slate-500"><strong className="text-indigo-400">Origin:</strong> {c.country}</p>}
          {c.activity && <p className="text-xs text-slate-500"><strong className="text-indigo-400">Activity:</strong> {c.activity}</p>}
        </div>
      ))}
    </div>
    {block.prompts && block.prompts.length > 0 && (
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Prompts to use:</span>
        <ul className="space-y-1">
          {block.prompts.map((pr: string, i: number) => <li key={i} className="text-sm text-slate-600 font-serif flex gap-2"><span className="text-indigo-400">•</span>{pr}</li>)}
        </ul>
      </div>
    )}
  </div>
);
