import type { ReactNode } from 'react';
import type { BlockFormProps, BlockPreviewProps, WritingTaskBlock } from '../types/index';

const linesToArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const renderInlineBold = (text: string): ReactNode[] =>
  text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });

const renderRichText = (text: string, className: string) =>
  text
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, index, allLines) => line.length > 0 || (allLines.length === 1 && index === 0))
    .map((line, index) => (
      <p key={index} className={className}>
        {renderInlineBold(line)}
      </p>
    ));

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
      placeholder="Simple description. Supports **bold**."
    />
    <textarea
      className="min-h-[82px] w-full rounded border p-2 text-xs"
      value={(block.checklist || []).join('\n')}
      onChange={(e) => onUpdate({ checklist: linesToArray(e.target.value) })}
      placeholder="Checklist, one item per line"
    />
  </div>
);

export const WritingTaskPreview = ({ block }: BlockPreviewProps<WritingTaskBlock>) => (
  <div className="my-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="border-b border-slate-200 pb-3">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Writing Assignment
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    </div>
    <div className="space-y-2 text-sm leading-6 text-slate-600">
      {renderRichText(block.prompt, 'text-sm leading-6 text-slate-600')}
    </div>
    <div className="relative">
      <textarea
        className="h-40 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-colors focus:border-slate-400"
        placeholder="Start writing here..."
      />
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
  </div>
);
