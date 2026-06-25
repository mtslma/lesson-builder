import { RenderSubQuestionsPreview, SubQuestionsEditor } from '../modules/Shared';
import type { BlockFormProps, BlockPreviewProps, CalendarClockBlock } from '../types/index';

const linesToArray = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);

export const CalendarClockForm = ({ block, onUpdate }: BlockFormProps<CalendarClockBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Calendar / clock title" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-xs" value={block.calendarNotes.join('\n')} onChange={(e) => onUpdate({ calendarNotes: linesToArray(e.target.value) })} placeholder="Calendar notes, one per line" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-xs" value={block.clockTimes.join('\n')} onChange={(e) => onUpdate({ clockTimes: linesToArray(e.target.value) })} placeholder="Clock times, one per line" />
    <SubQuestionsEditor questions={block.questions} onChange={(questions) => onUpdate({ questions })} />
  </div>
);

export const CalendarClockPreview = ({ block }: BlockPreviewProps<CalendarClockBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Calendar</div>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">{block.calendarNotes.map((item, index) => <li key={`${block.id}-cal-${index}`}>{item}</li>)}</ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Clock</div>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">{block.clockTimes.map((item, index) => <li key={`${block.id}-clock-${index}`}>{item}</li>)}</ul>
      </div>
    </div>
    <RenderSubQuestionsPreview questions={block.questions} storageKey={block.id} />
  </div>
);
