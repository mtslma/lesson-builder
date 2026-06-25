import type { BlockFormProps, BlockPreviewProps, WritingTaskBlock } from '../types/index';

const linesToArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const WritingTaskForm = ({ block, onUpdate }: BlockFormProps<WritingTaskBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full rounded border p-2 text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Title"
    />
    <textarea
      className="h-20 w-full rounded border p-2 text-sm"
      value={block.prompt}
      onChange={(e) => onUpdate({ prompt: e.target.value })}
      placeholder="Writing Prompt"
    />
    <textarea
      className="min-h-[82px] w-full rounded border p-2 text-xs"
      value={(block.sentenceStarters || []).join('\n')}
      onChange={(e) => onUpdate({ sentenceStarters: linesToArray(e.target.value) })}
      placeholder="Sentence starters, one per line"
    />
    <textarea
      className="min-h-[82px] w-full rounded border p-2 text-xs"
      value={(block.suggestedVocabulary || []).join('\n')}
      onChange={(e) => onUpdate({ suggestedVocabulary: linesToArray(e.target.value) })}
      placeholder="Suggested vocabulary, one per line"
    />
    <input
      type="text"
      className="w-full rounded border p-2 text-sm"
      value={block.grammarReminder || ''}
      onChange={(e) => onUpdate({ grammarReminder: e.target.value })}
      placeholder="Grammar reminder"
    />
    <textarea
      className="min-h-[82px] w-full rounded border p-2 text-xs"
      value={(block.checklist || []).join('\n')}
      onChange={(e) => onUpdate({ checklist: linesToArray(e.target.value) })}
      placeholder="Checklist, one item per line"
    />
    <input
      type="number"
      className="w-24 rounded border p-2 text-sm"
      value={block.minWords || ''}
      onChange={(e) => onUpdate({ minWords: Number(e.target.value) || undefined })}
      placeholder="Min Words"
    />
    <textarea
      className="min-h-[82px] w-full rounded border p-2 text-xs"
      value={block.rubric || ''}
      onChange={(e) => onUpdate({ rubric: e.target.value })}
      placeholder="Optional rubric"
    />
  </div>
);

export const WritingTaskPreview = ({ block }: BlockPreviewProps<WritingTaskBlock>) => (
  <div className="my-8 space-y-4 rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-md">
    <div className="border-b-2 border-slate-100 pb-3">
      <span className="mb-1 block font-mono text-[10px] font-black uppercase tracking-widest text-slate-400">
        Writing Assignment
      </span>
      <h3 className="font-serif text-lg font-bold text-slate-900">{block.title}</h3>
    </div>
    <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 font-serif text-sm italic leading-relaxed text-slate-600">
      {block.prompt}
    </p>
    {block.grammarReminder && (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Grammar reminder:</strong> {block.grammarReminder}
      </div>
    )}
    {(block.sentenceStarters || []).length > 0 && (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Sentence starters
        </div>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {(block.sentenceStarters || []).map((item, index) => (
            <li key={`${block.id}-starter-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    )}
    {(block.suggestedVocabulary || []).length > 0 && (
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Suggested vocabulary
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(block.suggestedVocabulary || []).map((item, index) => (
            <span key={`${block.id}-vocab-${index}`} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
              {item}
            </span>
          ))}
        </div>
      </div>
    )}
    <div className="relative">
      <textarea
        className="h-40 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-sm text-slate-800 outline-none transition-colors focus:border-slate-400 focus:bg-white"
        placeholder="Start writing here..."
      />
      {block.minWords && (
        <span className="absolute bottom-3 right-3 font-mono text-[10px] font-bold text-slate-400">
          Min words: {block.minWords}
        </span>
      )}
    </div>
    {(block.checklist || []).length > 0 && (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Checklist
        </div>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {(block.checklist || []).map((item, index) => (
            <li key={`${block.id}-check-${index}`}>- {item}</li>
          ))}
        </ul>
      </div>
    )}
    {block.rubric && (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
        <strong>Rubric:</strong> {block.rubric}
      </div>
    )}
  </div>
);
