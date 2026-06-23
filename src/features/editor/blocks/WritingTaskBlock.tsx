import type { BlockFormProps, BlockPreviewProps, WritingTaskBlock } from '../types/index';

export const WritingTaskForm = ({ block, onUpdate }: BlockFormProps<WritingTaskBlock>) => (
  <div className="space-y-2">
    <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Title" />
    <textarea className="w-full p-2 border rounded text-sm h-16" value={block.prompt} onChange={(e) => onUpdate({ prompt: e.target.value })} placeholder="Writing Prompt" />
    <input type="number" className="w-24 p-2 border rounded text-sm" value={block.minWords || ''} onChange={(e) => onUpdate({ minWords: Number(e.target.value) })} placeholder="Min Words" />
  </div>
);

export const WritingTaskPreview = ({ block }: BlockPreviewProps<WritingTaskBlock>) => (
  <div className="my-8 p-6 border-2 border-slate-900 bg-white rounded-2xl shadow-md space-y-4">
    <div className="border-b-2 border-slate-100 pb-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-1">Writing Assignment</span>
      <h3 className="text-lg font-bold font-serif text-slate-900">{block.title}</h3>
    </div>
    <p className="text-sm text-slate-600 font-serif italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{block.prompt}</p>
    <div className="relative">
      <textarea className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:bg-white focus:border-slate-400 transition-colors font-sans text-sm text-slate-800" placeholder="Start writing here..." />
      {block.minWords && <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-slate-400">Min words: {block.minWords}</span>}
    </div>
  </div>
);
