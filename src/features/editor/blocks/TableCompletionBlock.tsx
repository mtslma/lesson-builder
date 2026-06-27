import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import { createPreviewStorageKey } from '../domain/previewState';
import { createTableCompletionRow } from '../domain/blockDefaults';
import { moveItem, removeItemAt } from '../domain/collections';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import type { BlockFormProps, BlockPreviewProps, TableCompletionBlock } from '../types/index';

const createCellValue = (row: TableCompletionBlock['rows'][number], index: number) => row.cells[index] || '';

export const TableCompletionForm = ({ block, onUpdate }: BlockFormProps<TableCompletionBlock>) => {
  const updateHeader = (index: number, value: string) => {
    const nextHeaders = [...block.headers];
    nextHeaders[index] = value;
    onUpdate({ headers: nextHeaders });
  };

  const addHeader = () => {
    if (block.headers.length >= 4) return;

    onUpdate({
      headers: [...block.headers, `Answer ${block.headers.length}`],
      rows: block.rows.map((row) => ({
        ...row,
        cells: [...row.cells, '']
      }))
    });
  };

  const moveHeader = (index: number, direction: -1 | 1) =>
    onUpdate({
      headers: moveItem(block.headers, index, direction),
      rows: block.rows.map((row) => ({
        ...row,
        cells: moveItem(row.cells, index, direction)
      }))
    });

  const removeHeader = (headerIndex: number) => {
    if (block.headers.length <= 2) return;

    onUpdate({
      headers: removeItemAt(block.headers, headerIndex),
      rows: block.rows.map((row) => ({
        ...row,
        cells: removeItemAt(row.cells, headerIndex)
      }))
    });
  };

  const addRow = () =>
    onUpdate({
      rows: [...block.rows, createTableCompletionRow(block.headers.length)]
    });

  const moveRow = (index: number, direction: -1 | 1) =>
    onUpdate({
      rows: moveItem(block.rows, index, direction)
    });

  const duplicateRow = (rowIndex: number) => {
    const sourceRow = block.rows[rowIndex];
    if (!sourceRow) return;

    const nextRows = [...block.rows];
    nextRows.splice(rowIndex + 1, 0, {
      ...sourceRow,
      id: crypto.randomUUID(),
      cells: [...sourceRow.cells]
    });
    onUpdate({ rows: nextRows });
  };

  const removeRow = (rowIndex: number) =>
    onUpdate({
      rows: removeItemAt(block.rows, rowIndex)
    });

  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    const nextRows = [...block.rows];
    nextRows[rowIndex] = {
      ...nextRows[rowIndex],
      cells: nextRows[rowIndex].cells.map((cell, index) => (index === cellIndex ? value : cell))
    };
    onUpdate({ rows: nextRows });
  };

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Table title"
      />
      <textarea
        className="min-h-[72px] w-full rounded border p-2 text-sm"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction"
      />
      <input
        className="w-full rounded border p-2 text-sm"
        value={block.audioUrl || ''}
        onChange={(e) => onUpdate({ audioUrl: e.target.value })}
        placeholder="Audio URL"
      />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Table structure
          </span>
          <button
            type="button"
            onClick={addHeader}
            disabled={block.headers.length >= 4}
            className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 disabled:opacity-40"
          >
            <Plus size={12} />
            Column
          </button>
        </div>

        <div className="overflow-x-auto pb-1">
          <div
            className="flex gap-2"
            style={{ minWidth: `${Math.max(block.headers.length, 1) * 220}px` }}
          >
            {block.headers.map((header, index) => (
              <div
                key={index}
                className="min-w-[220px] flex-1 rounded-xl border border-slate-200 bg-white p-2"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Col {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveHeader(index, -1)}
                      disabled={index === 0}
                      className="rounded border border-slate-200 bg-white p-1 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHeader(index, 1)}
                      disabled={index === block.headers.length - 1}
                      className="rounded border border-slate-200 bg-white p-1 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowRight size={12} />
                    </button>
                    {block.headers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="rounded border border-red-200 bg-red-50 p-1 text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full rounded border p-1.5 text-xs"
                  value={header}
                  onChange={(e) => updateHeader(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Table rows
          </span>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700"
          >
            <Plus size={12} />
            Row
          </button>
        </div>

        {block.rows.map((row, rowIndex) => (
          <div key={row.id} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Row {rowIndex + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(rowIndex, -1)}
                  disabled={rowIndex === 0}
                  className="rounded border border-slate-200 bg-white p-1 text-slate-500 disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(rowIndex, 1)}
                  disabled={rowIndex === block.rows.length - 1}
                  className="rounded border border-slate-200 bg-white p-1 text-slate-500 disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => duplicateRow(rowIndex)}
                  className="rounded border border-slate-200 bg-white p-1 text-slate-500"
                >
                  <Copy size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(rowIndex)}
                  className="rounded border border-red-200 bg-red-50 p-1 text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto pb-1">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(block.headers.length, 1)}, minmax(220px, 1fr))`,
                  minWidth: `${Math.max(block.headers.length, 1) * 220}px`
                }}
              >
                {block.headers.map((header, cellIndex) => (
                  <div
                    key={`${row.id}-${cellIndex}`}
                    className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {header || `Cell ${cellIndex + 1}`}
                    </span>
                    <textarea
                      className="min-h-[64px] w-full resize-y rounded border p-2 text-xs"
                      value={createCellValue(row, cellIndex)}
                      onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                      placeholder={cellIndex === 0 ? 'Prompt / text' : `Answer ${cellIndex}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableCompletionPreview = ({ block }: BlockPreviewProps<TableCompletionBlock>) => {
  const [answers, setAnswers] = usePersistedPreviewState<Record<string, string>>(
    createPreviewStorageKey(block.id, 'table-completion.answers'),
    {}
  );

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
      {block.audioUrl?.trim() && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <audio controls className="w-full">
            <source src={block.audioUrl} />
          </audio>
        </div>
      )}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th
                  key={`${block.id}-h-${index}`}
                  className="min-w-[180px] border border-slate-200 bg-slate-100 p-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.id}>
                {block.headers.map((_, index) => {
                  const answerKey = `${row.id}-${index}`;
                  const isPromptColumn = index === 0;

                  return (
                    <td
                      key={`${row.id}-${index}`}
                      className="min-w-[180px] border border-slate-200 p-3 align-top text-sm leading-6 text-slate-700"
                    >
                      {isPromptColumn ? (
                        <div className="whitespace-pre-wrap">{createCellValue(row, index) || '...'}</div>
                      ) : (
                        <input
                          type="text"
                          value={answers[answerKey] || ''}
                          onChange={(e) =>
                            setAnswers((current) => ({
                              ...current,
                              [answerKey]: e.target.value
                            }))
                          }
                          className="inline-block w-full rounded-lg border border-slate-300 bg-white px-2.5 py-[0.1rem] text-center text-sm font-medium leading-5 text-slate-700 outline-none transition focus:border-slate-500"
                          placeholder={createCellValue(row, index) || '...'}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
