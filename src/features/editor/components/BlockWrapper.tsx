import React from 'react';
import { ArrowDown, ArrowUp, Copy, Trash2 } from 'lucide-react';
import type { BlockAudience, LessonBlock } from '../types/index';
import { blockFormRegistry } from '../config/formRegistry';
import { BLOCK_LABELS } from '../config/blockMeta';

interface Props {
  block: LessonBlock;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (id: string, fields: Partial<LessonBlock>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const BlockWrapper: React.FC<Props> = ({
  block,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove
}) => {
  const FormComponent = blockFormRegistry[block.type];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50/70 p-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all hover:border-slate-300 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-80"></div>
      <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3 select-none">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
            Block {index + 1}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {BLOCK_LABELS[block.type]}
          </span>
          <select
            value={block.audience || 'both'}
            onChange={(event) =>
              onUpdate(block.id, { audience: event.target.value as BlockAudience })
            }
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500"
          >
            <option value="both">Both</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMove(index, 'up')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-sky-200 hover:text-sky-700 disabled:opacity-30"
          >
            <ArrowUp size={14} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMove(index, 'down')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-sky-200 hover:text-sky-700 disabled:opacity-30"
          >
            <ArrowDown size={14} strokeWidth={2.2} />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-200"></div>
          <button
            type="button"
            onClick={() => onDuplicate(block.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <Copy size={12} strokeWidth={2.2} />
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => onRemove(block.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={12} strokeWidth={2.2} />
            Remove
          </button>
        </div>
      </div>
      <div className="editor-form-grid">
        {FormComponent ? (
          <FormComponent block={block} onUpdate={(f) => onUpdate(block.id, f)} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-500">
            Raw JSON editing remains available for <strong className="text-slate-700">{block.type}</strong>.
          </div>
        )}
      </div>
    </div>
  );
};
