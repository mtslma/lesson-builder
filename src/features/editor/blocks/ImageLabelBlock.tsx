import { createImageLabelItem } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import type { BlockFormProps, BlockPreviewProps, ImageLabelBlock } from '../types/index';

export const ImageLabelForm = ({ block, onUpdate }: BlockFormProps<ImageLabelBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Image label title" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    <input className="w-full rounded border p-2 text-sm" value={block.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} placeholder="Image URL" />
    {block.labels.map((label, index) => (
      <div key={label.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <input className="rounded border p-2 text-xs" value={label.prompt} onChange={(e) => onUpdate({ labels: updateItemAt(block.labels, index, (current) => ({ ...current, prompt: e.target.value })) })} placeholder="Prompt" />
        <input className="rounded border p-2 text-xs" value={label.answer} onChange={(e) => onUpdate({ labels: updateItemAt(block.labels, index, (current) => ({ ...current, answer: e.target.value })) })} placeholder="Answer" />
        <button type="button" onClick={() => onUpdate({ labels: removeItemAt(block.labels, index) })} className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ labels: [...block.labels, createImageLabelItem()] })} className="text-xs font-bold text-blue-600">+ Add label</button>
  </div>
);

export const ImageLabelPreview = ({ block }: BlockPreviewProps<ImageLabelBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    {block.imageUrl && <img src={block.imageUrl} alt="" className="mt-4 h-64 w-full rounded-2xl object-cover" />}
    <div className="mt-4 space-y-2">
      {block.labels.map((label, index) => (
        <div key={label.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {index + 1}. {label.prompt}
        </div>
      ))}
    </div>
  </div>
);
