import React from 'react';

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Default', value: '#d9f99d' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Amber', value: '#fde68a' },
  { label: 'Rose', value: '#fecdd3' }
];

export const ConversationForm: React.FC<any> = ({ block, onUpdate }) => {
  const addMsg = () =>
    onUpdate({
      messages: [
        ...block.messages,
        {
          id: crypto.randomUUID(),
          speaker: '',
          text: '',
          highlighted: false,
          highlightColor: '#d9f99d'
        }
      ]
    });
  const removeMsg = (index: number) => onUpdate({ messages: block.messages.filter((_: any, messageIndex: number) => messageIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm mb-2" value={block.imageUrl || ''} onChange={(e) => onUpdate({ imageUrl: e.target.value })} placeholder="Context Image URL" />
      {block.messages.map((m: any, i: number) => (
        <div key={i} className="flex gap-2 items-center bg-slate-50 border p-1 rounded">
          <input type="text" className="w-1/4 p-1.5 border rounded text-xs font-bold" value={m.speaker} onChange={(e) => {
            const n = [...block.messages];
            n[i].speaker = e.target.value;
            onUpdate({ messages: n });
          }} placeholder="Speaker" />
          <input type="text" className="flex-1 p-1.5 border rounded text-xs" value={m.text} onChange={(e) => {
            const n = [...block.messages];
            n[i].text = e.target.value;
            onUpdate({ messages: n });
          }} placeholder="Dialogue" />
          <select className="w-24 p-1.5 border rounded text-xs" value={m.highlightColor || '#d9f99d'} onChange={(e) => {
            const n = [...block.messages];
            n[i].highlightColor = e.target.value;
            onUpdate({ messages: n });
          }}>
            {HIGHLIGHT_COLOR_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <span className="text-[10px] text-slate-500">Use `[text]`</span>
          <button type="button" onClick={() => removeMsg(i)} className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addMsg} className="text-xs text-blue-600 font-bold">+ Add Line</button>
    </div>
  );
};

const renderHighlightedDialogue = (message: {
  text: string;
  highlighted?: boolean;
  highlightColor?: string;
}) => {
  const color = message.highlightColor || '#d9f99d';
  if (!message.highlighted) return message.text;
  const bracketMatch = message.text.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    const fullMatch = bracketMatch[0];
    const highlightedContent = bracketMatch[1];
    const [before, after] = message.text.split(fullMatch);
    return <>{before}<span className="px-1 py-0.5 rounded font-bold border-b" style={{ backgroundColor: color, borderColor: color }}>{highlightedContent}</span>{after}</>;
  }
  return message.text;
};

export const ConversationPreview: React.FC<any> = ({ block }) => (
  <div className="space-y-4 bg-slate-50/80 p-6 rounded-2xl border border-slate-200 my-6 shadow-sm">
    {block.imageUrl && <img src={block.imageUrl} className="w-full h-32 object-cover rounded-lg border border-slate-200" alt="Context" />}
    {block.messages.map((m: any, i: number) => (
      <div key={i} className="flex gap-4 text-sm font-sans">
        <span className="font-extrabold text-slate-900 min-w-[60px] uppercase text-xs tracking-wide">{m.speaker}:</span>
        <p className="text-slate-800">{renderHighlightedDialogue(m)}</p>
      </div>
    ))}
    {block.substitutionBox && block.substitutionBox.length > 0 && (
      <div className="mt-4 pt-4 border-t border-dashed border-slate-300 space-y-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase">🔄 Alternatives:</span>
        {block.substitutionBox.map((sub: any, sIdx: number) => (
          <div key={sIdx} className="text-xs bg-white border p-2.5 rounded-lg text-slate-600 font-medium">
            <strong className="text-slate-900">{sub.original}</strong> → {sub.alternatives.join(' / ')}
          </div>
        ))}
      </div>
    )}
  </div>
);
