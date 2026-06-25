import { useState } from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import type { BlockFormProps, BlockPreviewProps, SelectionGridBlock } from '../types/index';
import { createSelectionGridItem } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import { shuffleArray } from '../domain/shuffle';

export const SelectionGridForm = ({ block, onUpdate }: BlockFormProps<SelectionGridBlock>) => {
  const addItem = () =>
    onUpdate({
      items: [...block.items, createSelectionGridItem()]
    });

  const removeItem = (index: number) =>
    onUpdate({ items: removeItemAt(block.items, index) });

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction..."
      />
      <label className="flex items-center gap-2 text-xs font-bold">
        <input
          type="checkbox"
          checked={block.isMultiSelect}
          onChange={(e) => onUpdate({ isMultiSelect: e.target.checked })}
        />
        Multi-select?
      </label>
      <div className="grid grid-cols-2 gap-2">
        {block.items.map((item, index) => (
          <div key={item.id} className="space-y-1 rounded border bg-slate-50 p-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={item.text}
              onChange={(e) => {
                onUpdate({
                  items: updateItemAt(block.items, index, (item) => ({
                    ...item,
                    text: e.target.value
                  }))
                });
              }}
              placeholder="Text"
            />
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={item.imageUrl || ''}
              onChange={(e) => {
                onUpdate({
                  items: updateItemAt(block.items, index, (item) => ({
                    ...item,
                    imageUrl: e.target.value
                  }))
                });
              }}
              placeholder="Img URL"
            />
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={Boolean(item.isCorrect)}
                onChange={(e) => {
                  onUpdate({
                    items: updateItemAt(block.items, index, (item) => ({
                      ...item,
                      isCorrect: e.target.checked
                    }))
                  });
                }}
              />
              Correct?
            </label>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs font-bold text-blue-600">
        + Add Option
      </button>
    </div>
  );
};

export const SelectionGridPreview = ({ block }: BlockPreviewProps<SelectionGridBlock>) => {
  const [selectedIds, setSelectedIds] = usePersistedPreviewState<string[]>(
    createPreviewStorageKey(block.id, 'selection-grid.answers'),
    []
  );
  const [shuffledItems] = useState(() => shuffleArray(block.items, `${block.id}:selection-grid`));

  const toggleItem = (itemId: string) =>
    setSelectedIds((prev) =>
      block.isMultiSelect
        ? prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
        : prev.includes(itemId)
          ? []
          : [itemId]
    );

  return (
    <div className="my-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="border-b pb-2 font-mono text-[10px] font-bold uppercase text-slate-400">
        Check and Say: {block.instruction}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {shuffledItems.map((item) => {
          const selected = selectedIds.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                selected
                  ? 'border-lime-500 bg-lime-50'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-300'
              }`}
            >
              {selected && (
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-[10px] font-bold text-slate-900 shadow-sm">
                  OK
                </div>
              )}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="mb-2 h-12 w-12 rounded-full border object-cover shadow-xs"
                />
              )}
              <span className="font-sans text-sm font-bold text-slate-700">{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
