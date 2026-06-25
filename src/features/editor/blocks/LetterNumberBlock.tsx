import { useEffect, useState, type ReactNode } from 'react';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { createEditorId } from '../domain/ids';
import type { BlockFormProps, BlockPreviewProps, LetterNumberBlock } from '../types/index';

const createItem = (symbol = '', label = ''): LetterNumberBlock['items'][number] => ({
  id: createEditorId(),
  symbol,
  label
});

const renderInlineFormatting = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(<strong key={`${match.index}-${match[0]}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

const getGridStyle = (itemsPerRow: number | undefined) => {
  const columns = Math.min(Math.max(itemsPerRow || 6, 1), 10);
  return {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 92px))`,
    justifyContent: 'center'
  } as const;
};

export const LetterNumberForm = ({ block, onUpdate }: BlockFormProps<LetterNumberBlock>) => (
  <LetterNumberFormInner block={block} onUpdate={onUpdate} />
);

const ITEMS_PER_PAGE = 5;

const LetterNumberFormInner = ({ block, onUpdate }: BlockFormProps<LetterNumberBlock>) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(block.items.length / ITEMS_PER_PAGE));
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleItems = block.items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Block title"
      />
      <textarea
        className="min-h-[70px] w-full rounded border p-2 text-sm"
        value={block.instruction || ''}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Optional instruction. Supports **bold**."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <select
          className="w-full rounded border p-2 text-sm"
          value={block.variant || 'letters'}
          onChange={(e) => onUpdate({ variant: e.target.value as LetterNumberBlock['variant'] })}
        >
          <option value="letters">Letters</option>
          <option value="numbers">Numbers</option>
          <option value="mixed">Mixed</option>
        </select>
        <select
          className="w-full rounded border p-2 text-sm"
          value={block.density || 'compact'}
          onChange={(e) => onUpdate({ density: e.target.value as LetterNumberBlock['density'] })}
        >
          <option value="compact">Compact</option>
          <option value="regular">Regular</option>
        </select>
        <input
          type="number"
          min={1}
          max={10}
          className="w-full rounded border p-2 text-sm"
          value={block.itemsPerRow || ''}
          onChange={(e) => onUpdate({ itemsPerRow: Number(e.target.value) || undefined })}
          placeholder="Items per row"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Items
          </span>
          <button
            type="button"
            onClick={() => onUpdate({ items: [...block.items, createItem()] })}
            className="text-xs font-bold text-blue-600"
          >
            + Add item
          </button>
        </div>

        {block.items.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="text-[11px] text-slate-500">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, block.items.length)} of {block.items.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="rounded border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 disabled:opacity-40"
              >
                Prev 5
              </button>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Page {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                disabled={page >= totalPages - 1}
                className="rounded border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 disabled:opacity-40"
              >
                Next 5
              </button>
            </div>
          </div>
        )}

        {visibleItems.map((item, visibleIndex) => {
          const index = startIndex + visibleIndex;

          return (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="grid gap-2 md:grid-cols-[100px_1fr_auto]">
                <input
                  type="text"
                  className="rounded border p-2 text-sm font-bold text-center"
                  value={item.symbol}
                  onChange={(e) =>
                    onUpdate({
                      items: updateItemAt(block.items, index, (current) => ({
                        ...current,
                        symbol: e.target.value
                      }))
                    })
                  }
                  placeholder="10"
                />
                <input
                  type="text"
                  className="rounded border p-2 text-xs"
                  value={item.label || ''}
                  onChange={(e) =>
                    onUpdate({
                      items: updateItemAt(block.items, index, (current) => ({
                        ...current,
                        label: e.target.value
                      }))
                    })
                  }
                  placeholder="Displayed text"
                />
                <button
                  type="button"
                  onClick={() => onUpdate({ items: removeItemAt(block.items, index) })}
                  className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LetterNumberPreview = ({ block }: BlockPreviewProps<LetterNumberBlock>) => {
  const compact = (block.density || 'compact') === 'compact';

  return (
    <div className="my-6 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {block.variant === 'numbers'
            ? 'Numbers'
            : block.variant === 'mixed'
              ? 'Letters & Numbers'
              : 'Alphabet'}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">{block.title}</h3>
        {block.instruction?.trim() && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {renderInlineFormatting(block.instruction)}
          </p>
        )}
      </div>

      <div className="mt-5 grid justify-center gap-2" style={getGridStyle(block.itemsPerRow)}>
        {block.items.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border border-slate-200 bg-white text-center ${
              compact ? 'px-2 py-3' : 'p-4'
            }`}
          >
            <div className={`${compact ? 'text-xl' : 'text-3xl'} font-semibold text-slate-900`}>
              {item.symbol}
            </div>
            {item.label?.trim() && (
              <p className={`mt-1 ${compact ? 'text-[11px]' : 'text-sm'} text-slate-600`}>
                {renderInlineFormatting(item.label)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
