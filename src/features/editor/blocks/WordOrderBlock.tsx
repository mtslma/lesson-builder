import { removeItemAt, updateItemAt } from '../domain/collections';
import { createWordOrderItem } from '../domain/blockDefaults';
import type { BlockFormProps, BlockPreviewProps, WordOrderBlock } from '../types/index';

export const WordOrderForm = ({ block, onUpdate }: BlockFormProps<WordOrderBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Word order title" />
    <textarea className="min-h-[70px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    {(block.items || []).map((item, index) => (
      <div key={item.id} className="space-y-2 rounded border bg-slate-50 p-3">
        <input className="w-full rounded border p-2 text-xs" value={item.prompt} onChange={(e) => onUpdate({ items: updateItemAt(block.items, index, (current) => ({ ...current, prompt: e.target.value })) })} placeholder="Prompt" />
        <textarea className="min-h-[70px] w-full rounded border p-2 text-xs" value={item.sequence.join('\n')} onChange={(e) => onUpdate({ items: updateItemAt(block.items, index, (current) => ({ ...current, sequence: e.target.value.split('\n').map((entry) => entry.trim()).filter(Boolean) })) })} placeholder="One token per line" />
        <button type="button" onClick={() => onUpdate({ items: removeItemAt(block.items, index) })} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ items: [...block.items, createWordOrderItem()] })} className="text-xs font-bold text-blue-600">+ Add item</button>
  </div>
);

export const WordOrderPreview = ({ block }: BlockPreviewProps<WordOrderBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    <div className="mt-4 space-y-4">
      {block.items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-medium text-slate-800">{item.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.sequence.map((token, index) => (
              <span key={`${item.id}-${index}`} className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700">
                {token}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
