import { RenderSubQuestionsPreview, SubQuestionsEditor } from '../modules/Shared';
import { removeItemAt, updateItemAt } from '../domain/collections';
import type { BlockFormProps, BlockPreviewProps, MiniMapBlock } from '../types/index';

export const MiniMapForm = ({ block, onUpdate }: BlockFormProps<MiniMapBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Map activity title" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    <input className="w-full rounded border p-2 text-sm" value={block.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} placeholder="Scene or map image URL" />
    {(block.markers || []).map((marker, index) => (
      <div key={marker.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <input className="rounded border p-2 text-xs" value={marker.label} onChange={(e) => onUpdate({ markers: updateItemAt(block.markers, index, (current) => ({ ...current, label: e.target.value })) })} placeholder="Marker label" />
        <input className="rounded border p-2 text-xs" value={marker.clue || ''} onChange={(e) => onUpdate({ markers: updateItemAt(block.markers, index, (current) => ({ ...current, clue: e.target.value })) })} placeholder="Optional clue" />
        <button type="button" onClick={() => onUpdate({ markers: removeItemAt(block.markers, index) })} className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ markers: [...block.markers, { id: `${block.id}-marker-${block.markers.length + 1}`, label: '', clue: '' }] })} className="text-xs font-bold text-blue-600">+ Add marker</button>
    <SubQuestionsEditor questions={block.questions} onChange={(questions) => onUpdate({ questions })} />
  </div>
);

export const MiniMapPreview = ({ block }: BlockPreviewProps<MiniMapBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    {block.imageUrl && <img src={block.imageUrl} alt="" className="mt-4 h-64 w-full rounded-2xl object-cover" />}
    <div className="mt-4 grid gap-2 md:grid-cols-2">
      {block.markers.map((marker) => (
        <div key={marker.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <strong>{marker.label}</strong> {marker.clue && <span>- {marker.clue}</span>}
        </div>
      ))}
    </div>
    <RenderSubQuestionsPreview questions={block.questions} storageKey={block.id} />
  </div>
);
