import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationPromptsBlock
} from '../types/index';

export const ConversationPromptsForm = ({
  block,
  onUpdate
}: BlockFormProps<ConversationPromptsBlock>) => (
  <div className="space-y-2">
    <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Title" />
    <textarea className="w-full p-2 border rounded text-sm h-24" value={block.prompts.join('\n')} onChange={(e) => onUpdate({ prompts: e.target.value.split('\n').filter(Boolean) })} placeholder="Prompts (One per line)" />
  </div>
);

export const ConversationPromptsPreview = ({
  block
}: BlockPreviewProps<ConversationPromptsBlock>) => (
  <div className="my-8 p-6 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-sm">
    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest font-mono block mb-4">💬 Discussion Time: {block.title}</span>
    <div className="space-y-3">
      {block.prompts.map((p: string, i: number) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs flex items-start gap-3">
          <span className="text-amber-500 font-black text-lg leading-none">Q.</span>
          <p className="text-base font-serif font-bold text-slate-800 leading-relaxed">{p}</p>
        </div>
      ))}
    </div>
  </div>
);
