import type {
  BlockFormProps,
  BlockPreviewProps,
  RepetitionDrillBlock
} from '../types/index';

export const RepetitionDrillForm = ({ block, onUpdate }: BlockFormProps<RepetitionDrillBlock>) => {
  const addWord = () => onUpdate({ words: [...block.words, { word: '' }] });
  const removeWord = (index: number) =>
    onUpdate({ words: block.words.filter((_, wordIndex) => wordIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Title" />
      {block.words.map((w, i) => (
        <div key={i} className="flex gap-2 border p-2 rounded bg-slate-50">
          <input type="text" className="w-1/3 p-1 border rounded text-xs font-bold" value={w.word} onChange={(e) => {
            const n = [...block.words];
            n[i].word = e.target.value;
            onUpdate({ words: n });
          }} placeholder="Word" />
          <input type="text" className="w-1/3 p-1 border rounded text-xs font-mono" value={w.phonetic || ''} onChange={(e) => {
            const n = [...block.words];
            n[i].phonetic = e.target.value;
            onUpdate({ words: n });
          }} placeholder="/Phonetic/" />
          <input type="text" className="w-1/3 p-1 border rounded text-xs" value={w.translation || ''} onChange={(e) => {
            const n = [...block.words];
            n[i].translation = e.target.value;
            onUpdate({ words: n });
          }} placeholder="Translation" />
          <button type="button" onClick={() => removeWord(i)} className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addWord} className="text-xs text-blue-600 font-bold">+ Add Word</button>
    </div>
  );
};

export const RepetitionDrillPreview = ({ block }: BlockPreviewProps<RepetitionDrillBlock>) => (
  <div className="my-6 p-6 border rounded-2xl shadow-sm bg-white">
    <span className="text-[10px] font-black uppercase tracking-widest font-mono block mb-4">Pronunciation: {block.title}</span>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {block.words.map((w, i) => (
        <div key={i} className="flex flex-col p-3 border rounded-xl bg-slate-50 hover:border-lime-400 group">
          <span className="text-base font-bold">{w.word}</span>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-slate-400">{w.phonetic}</span>
            <span className="text-xs font-medium text-slate-500 italic opacity-0 group-hover:opacity-100">{w.translation}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
