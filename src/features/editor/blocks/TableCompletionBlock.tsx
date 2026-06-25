import { createTableCompletionRow } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { RenderSubQuestionsPreview, SubQuestionsEditor } from '../modules/Shared';
import type { BlockFormProps, BlockPreviewProps, TableCompletionBlock } from '../types/index';

export const TableCompletionForm = ({ block, onUpdate }: BlockFormProps<TableCompletionBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Table title" />
    <textarea className="min-h-[72px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    <input
      className="w-full rounded border p-2 text-xs"
      value={block.headers.join(' | ')}
      onChange={(e) => onUpdate({ headers: e.target.value.split('|').map((item) => item.trim()) })}
      placeholder="Headers separated by |"
    />
    {(block.rows || []).map((row, index) => (
      <div key={row.id} className="flex gap-2">
        <input
          className="flex-1 rounded border p-2 text-xs"
          value={row.cells.join(' | ')}
          onChange={(e) =>
            onUpdate({
              rows: updateItemAt(block.rows, index, (current) => ({
                ...current,
                cells: e.target.value.split('|').map((cell) => cell.trim())
              }))
            })
          }
        />
        <button type="button" onClick={() => onUpdate({ rows: removeItemAt(block.rows, index) })} className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ rows: [...block.rows, createTableCompletionRow(block.headers.length)] })} className="text-xs font-bold text-blue-600">+ Add row</button>
    <SubQuestionsEditor questions={block.questions || []} onChange={(questions) => onUpdate({ questions })} />
  </div>
);

export const TableCompletionPreview = ({ block }: BlockPreviewProps<TableCompletionBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{block.headers.map((header, index) => <th key={`${block.id}-h-${index}`} className="border-b px-3 py-2 text-left">{header}</th>)}</tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.id}>{row.cells.map((cell, index) => <td key={`${row.id}-${index}`} className="border-b px-3 py-2">{cell || '...'}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
    <RenderSubQuestionsPreview questions={block.questions || []} storageKey={block.id} />
  </div>
);
