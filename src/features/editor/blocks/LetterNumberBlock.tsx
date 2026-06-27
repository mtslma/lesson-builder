import { useEffect, useState, type ReactNode } from 'react';
import { ChevronIcon } from '../components/ChevronIcon';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { createEditorId } from '../domain/ids';
import type { BlockFormProps, BlockPreviewProps, LetterNumberBlock } from '../types/index';

const createItem = (symbol = '', label = ''): LetterNumberBlock['items'][number] => ({
  id: createEditorId(),
  symbol,
  label
});

const NUMBER_WORDS_1_TO_19 = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen'
];

const TENS_WORDS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety'
];

const numberToWords = (value: number) => {
  if (value <= 0) return String(value);
  if (value < 20) return NUMBER_WORDS_1_TO_19[value];
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const units = value % 10;
    return units === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]} ${NUMBER_WORDS_1_TO_19[units]}`;
  }

  if (value === 100) {
    return 'one hundred';
  }

  return String(value);
};

const capitalizeFirstLetter = (value: string) =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const createNumberItems = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => {
    const value = start + index;
    return createItem(String(value), capitalizeFirstLetter(numberToWords(value)));
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
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
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
      <div className="grid gap-3 md:grid-cols-4">
        <select
          className="w-full rounded border p-2 text-sm"
          value={block.variant || 'letters'}
          onChange={(e) => {
            const nextVariant = e.target.value as LetterNumberBlock['variant'];

            if (nextVariant === 'numbers') {
              onUpdate({
                variant: nextVariant,
                title: block.title?.trim() ? block.title : 'Numbers 1-100',
                items: createNumberItems(1, 100)
              });
              return;
            }

            onUpdate({ variant: nextVariant });
          }}
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
        <input
          type="number"
          min={1}
          max={40}
          className="w-full rounded border p-2 text-sm"
          value={block.itemsPerPage || ''}
          onChange={(e) => onUpdate({ itemsPerPage: Number(e.target.value) || undefined })}
          placeholder="Items per page"
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
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, block.items.length)}{' '}
              of {block.items.length}
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
  const itemsPerRow = Math.min(Math.max(block.itemsPerRow || 6, 1), 10);
  const previewItemsPerPage = Math.max(block.itemsPerPage || 20, 1);
  const totalPages = Math.max(1, Math.ceil(block.items.length / previewItemsPerPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const startIndex = page * previewItemsPerPage;
  const visibleItems = block.items.slice(startIndex, startIndex + previewItemsPerPage);

  return (
    <div className="my-6 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm">
      {/* Container do Título Relativo para fixar os botões de paginação no topo */}
      <div className="relative border-b border-slate-200 pb-4 px-14 text-center">
        {totalPages > 1 && (
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
            className="absolute left-0 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition hover:scale-105 disabled:opacity-35"
            aria-label="Previous page"
          >
            <ChevronIcon className="h-4 w-4 rotate-180" />
          </button>
        )}

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

        {totalPages > 1 && (
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={page === totalPages - 1}
            className="absolute right-0 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition hover:scale-105 disabled:opacity-35"
            aria-label="Next page"
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5">
        <div className="px-3">
          <div className="grid gap-2" style={getGridStyle(itemsPerRow)}>
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex h-full min-w-0 flex-col items-center rounded-xl border border-slate-200 bg-white text-center ${
                  compact ? 'px-1 py-2.5' : 'px-2 py-3'
                }`}
              >
                <div
                  className={`flex w-full items-center justify-center rounded-lg bg-slate-50 font-semibold text-slate-900 ${
                    compact ? 'min-h-9 px-1.5 py-1.5 text-lg' : 'min-h-11 px-2 py-2 text-xl'
                  }`}
                >
                  <span className="min-w-0 truncate text-center leading-tight">{item.symbol}</span>
                </div>
                {item.label?.trim() && (
                  <p
                    className={`mt-1 w-full text-center whitespace-nowrap px-0.5 overflow-hidden text-ellipsis ${
                      compact ? 'text-[10px]' : 'text-xs'
                    } text-slate-600`}
                    title={item.label}
                  >
                    {renderInlineFormatting(item.label)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 text-center text-xs font-semibold text-slate-500">
            Page {page + 1} / {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};
