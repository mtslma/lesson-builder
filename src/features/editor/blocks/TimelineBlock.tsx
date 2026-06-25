import { RenderSubQuestionsPreview, SubQuestionsEditor } from '../modules/Shared';
import { removeItemAt, updateItemAt } from '../domain/collections';
import type { BlockFormProps, BlockPreviewProps, TimelineBlock } from '../types/index';

export const TimelineForm = ({ block, onUpdate }: BlockFormProps<TimelineBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Timeline title" />
    {(block.events || []).map((event, index) => (
      <div key={event.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <input className="rounded border p-2 text-xs" value={event.label} onChange={(e) => onUpdate({ events: updateItemAt(block.events, index, (current) => ({ ...current, label: e.target.value })) })} placeholder="Event label" />
        <input className="rounded border p-2 text-xs" value={event.time} onChange={(e) => onUpdate({ events: updateItemAt(block.events, index, (current) => ({ ...current, time: e.target.value })) })} placeholder="Date / order" />
        <button type="button" onClick={() => onUpdate({ events: removeItemAt(block.events, index) })} className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ events: [...block.events, { id: `${block.id}-event-${block.events.length + 1}`, label: '', time: '' }] })} className="text-xs font-bold text-blue-600">+ Add event</button>
    <SubQuestionsEditor questions={block.questions || []} onChange={(questions) => onUpdate({ questions })} />
  </div>
);

export const TimelinePreview = ({ block }: BlockPreviewProps<TimelineBlock>) => (
  <div className="my-6 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm">
    <div className="border-b border-slate-200 pb-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
        Story Points
      </span>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{block.title}</h3>
    </div>

    <div className="relative mt-6 space-y-5">
      <div className="absolute bottom-0 left-[85px] top-0 w-[3px] rounded-full bg-[linear-gradient(180deg,#a78bfa_0%,#d8b4fe_45%,#cbd5e1_100%)]" />

      {block.events.map((event, index) => (
        <div key={event.id} className="relative grid gap-4 md:grid-cols-[72px_26px_1fr] md:items-start">
          <div className="pt-1 text-right text-xs font-bold uppercase tracking-[0.12em] text-violet-500">
            {event.time || `Step ${index + 1}`}
          </div>

          <div className="relative flex min-h-[100%] items-start justify-center">
            <div className="relative z-10 mt-1 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(139,92,246,0.18)]">
              <div className="h-3.5 w-3.5 rounded-full bg-violet-500 shadow-[0_0_0_4px_rgba(196,181,253,0.95)]" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Point {index + 1}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{event.label}</p>
          </div>
        </div>
      ))}
    </div>

    <RenderSubQuestionsPreview questions={block.questions || []} storageKey={block.id} />
  </div>
);
