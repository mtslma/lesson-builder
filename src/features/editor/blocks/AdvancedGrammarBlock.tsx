import type { ReactNode } from 'react';
import type { AdvancedGrammarBlock, BlockFormProps, BlockPreviewProps, ConversationHighlight } from '../types/index';
import { removeItemAt } from '../domain/collections';

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Green', value: '#d9f99d' },
  { label: 'Purple', value: '#d6b2eea2' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Amber', value: '#fde68a' },
  { label: 'Rose', value: '#fecdd3' }
] as const;

const createCell = (text = '') => ({
  text,
  highlights: [] as ConversationHighlight[]
});

const createHighlight = (): ConversationHighlight => ({
  id: crypto.randomUUID(),
  text: '',
  color: '#d9f99d'
});

const renderParagraphs = (content: string, className: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className={className}>
        {paragraph}
      </p>
    ));

const renderHighlightedText = (
  text: string,
  highlights: ConversationHighlight[]
): ReactNode => {
  const validHighlights = highlights.filter(
    (highlight) => highlight.text.trim().length > 0 && text.includes(highlight.text)
  );

  if (validHighlights.length === 0) {
    return text;
  }

  const matches = validHighlights
    .flatMap((highlight) => {
      const occurrences: Array<{ start: number; end: number; color: string; id: string }> = [];
      let searchStart = 0;

      while (searchStart < text.length) {
        const start = text.indexOf(highlight.text, searchStart);

        if (start === -1) {
          break;
        }

        occurrences.push({
          start,
          end: start + highlight.text.length,
          color: highlight.color,
          id: `${highlight.id}-${start}`
        });

        searchStart = start + highlight.text.length;
      }

      return occurrences;
    })
    .sort((first, second) => {
      if (first.start !== second.start) {
        return first.start - second.start;
      }

      return second.end - first.end;
    })
    .filter((match, index, allMatches) => {
      return !allMatches.some(
        (otherMatch, otherIndex) => otherIndex < index && match.start < otherMatch.end
      );
    });

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      parts.push(<span key={`text-${cursor}`}>{text.slice(cursor, match.start)}</span>);
    }

    parts.push(
      <span
        key={match.id}
        className="rounded border-b px-1 py-0.5 font-semibold"
        style={{ backgroundColor: match.color, borderColor: match.color }}
      >
        {text.slice(match.start, match.end)}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(<span key={`text-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return parts;
};

export const AdvancedGrammarForm = ({
  block,
  onUpdate
}: BlockFormProps<AdvancedGrammarBlock>) => {
  const updateHeader = (index: number, value: string) => {
    const nextHeaders = [...block.tableHeaders];
    nextHeaders[index] = value;
    onUpdate({ tableHeaders: nextHeaders });
  };

  const addHeader = () => {
    onUpdate({
      tableHeaders: [...block.tableHeaders, 'New Col'],
      tableRows: block.tableRows.map((row) => ({
        cells: [...row.cells, createCell()]
      }))
    });
  };

  const removeHeader = (headerIndex: number) =>
    onUpdate({
      tableHeaders: removeItemAt(block.tableHeaders, headerIndex),
      tableRows: block.tableRows.map((row) => ({
        cells: removeItemAt(row.cells, headerIndex)
      }))
    });

  const addRow = () =>
    onUpdate({
      tableRows: [...block.tableRows, { cells: Array(block.tableHeaders.length).fill(null).map(() => createCell()) }]
    });

  const removeRow = (rowIndex: number) =>
    onUpdate({ tableRows: removeItemAt(block.tableRows, rowIndex) });

  const updateCellText = (rowIndex: number, cellIndex: number, value: string) => {
    const nextRows = [...block.tableRows];
    nextRows[rowIndex].cells[cellIndex].text = value;
    onUpdate({ tableRows: nextRows });
  };

  const addCellHighlight = (rowIndex: number, cellIndex: number) => {
    const nextRows = [...block.tableRows];
    nextRows[rowIndex].cells[cellIndex].highlights.push(createHighlight());
    onUpdate({ tableRows: nextRows });
  };

  const updateCellHighlight = (
    rowIndex: number,
    cellIndex: number,
    highlightIndex: number,
    field: keyof ConversationHighlight,
    value: string
  ) => {
    const nextRows = [...block.tableRows];
    nextRows[rowIndex].cells[cellIndex].highlights[highlightIndex] = {
      ...nextRows[rowIndex].cells[cellIndex].highlights[highlightIndex],
      [field]: value
    };
    onUpdate({ tableRows: nextRows });
  };

  const removeCellHighlight = (rowIndex: number, cellIndex: number, highlightIndex: number) => {
    const nextRows = [...block.tableRows];
    nextRows[rowIndex].cells[cellIndex].highlights = removeItemAt(
      nextRows[rowIndex].cells[cellIndex].highlights,
      highlightIndex
    );
    onUpdate({ tableRows: nextRows });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Grammar Topic"
      />

      <textarea
        className="min-h-[110px] w-full rounded border p-2 text-sm"
        value={block.explanation}
        onChange={(e) => onUpdate({ explanation: e.target.value })}
        placeholder="Main explanation. Use a blank line to start a new paragraph."
      />

      <textarea
        className="min-h-[90px] w-full rounded border p-2 text-sm"
        value={block.details || ''}
        onChange={(e) => onUpdate({ details: e.target.value })}
        placeholder="Optional extra notes, reminders or teaching explanations."
      />

      <div className="space-y-2 rounded border bg-slate-50 p-2">
        <span className="block text-[10px] font-bold uppercase">Table Headers</span>
        <div className="flex gap-1">
          {block.tableHeaders.map((header, index) => (
            <div key={index} className="flex flex-1 gap-1">
              <input
                type="text"
                className="flex-1 rounded border p-1 text-xs"
                value={header}
                onChange={(e) => updateHeader(index, e.target.value)}
              />
              {block.tableHeaders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHeader(index)}
                  className="rounded border border-red-200 bg-white px-2 text-[10px] font-bold text-red-500"
                >
                  -
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addHeader}
            className="rounded bg-blue-100 px-2 text-xs font-bold text-blue-600"
          >
            +
          </button>
        </div>

        {block.tableRows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-2 rounded border border-slate-200 bg-white p-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove row
              </button>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(block.tableHeaders.length, 1)}, minmax(0, 1fr))` }}>
              {row.cells.map((cell, cellIndex) => (
                <div key={cellIndex} className="space-y-2 rounded border border-slate-200 bg-slate-50 p-2">
                  <textarea
                    className="min-h-[72px] w-full resize-y rounded border p-2 text-xs"
                    value={cell.text}
                    onChange={(e) => updateCellText(rowIndex, cellIndex, e.target.value)}
                  />

                  <div className="space-y-2 rounded border border-dashed border-slate-300 bg-white p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Highlights
                      </span>
                      <button
                        type="button"
                        onClick={() => addCellHighlight(rowIndex, cellIndex)}
                        className="text-xs font-bold text-blue-600"
                      >
                        + Add
                      </button>
                    </div>

                    {cell.highlights.map((highlight, highlightIndex) => (
                      <div key={highlight.id} className="space-y-2">
                        <input
                          type="text"
                          className="w-full rounded border p-1.5 text-xs"
                          value={highlight.text}
                          onChange={(e) =>
                            updateCellHighlight(rowIndex, cellIndex, highlightIndex, 'text', e.target.value)
                          }
                          placeholder="Exact text to highlight"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            className="flex-1 rounded border p-1.5 text-xs"
                            value={highlight.color}
                            onChange={(e) =>
                              updateCellHighlight(rowIndex, cellIndex, highlightIndex, 'color', e.target.value)
                            }
                          >
                            {HIGHLIGHT_COLOR_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeCellHighlight(rowIndex, cellIndex, highlightIndex)}
                            className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="mt-1 rounded bg-slate-200 px-2 py-1 text-[10px] font-bold"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
};

export const AdvancedGrammarPreview = ({ block }: BlockPreviewProps<AdvancedGrammarBlock>) => (
  <div className="my-8 overflow-hidden rounded-xl border border-slate-300 bg-white">
    <div className="border-b border-slate-200 px-5 py-4">
      <h3 className="text-base font-semibold text-slate-900">{block.title}</h3>
    </div>

    <div className="space-y-4 px-5 py-4">
      <div className="space-y-3">
        {renderParagraphs(block.explanation, 'text-sm leading-6 text-slate-700')}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border-collapse text-left">
          <thead>
            <tr>
              {block.tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="border border-slate-200 bg-slate-100 p-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.tableRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="whitespace-pre-wrap border border-slate-200 p-3 align-top text-sm leading-6 text-slate-700"
                  >
                    {renderHighlightedText(cell.text, cell.highlights)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {block.details && block.details.trim().length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Notes
          </div>
          <div className="space-y-3">
            {renderParagraphs(block.details, 'text-sm leading-6 text-slate-700')}
          </div>
        </div>
      )}
    </div>
  </div>
);
