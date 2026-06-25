import { useState } from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import type {
  BlockFormProps,
  BlockPreviewProps,
  VocabularyMatchBlock
} from '../types/index';
import { createVocabularyPair } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import { shuffleArray } from '../domain/shuffle';

export const VocabularyMatchForm = ({
  block,
  onUpdate
}: BlockFormProps<VocabularyMatchBlock>) => {
  const addPair = () =>
    onUpdate({ pairs: [...block.pairs, createVocabularyPair()] });

  const removePair = (index: number) =>
    onUpdate({ pairs: removeItemAt(block.pairs, index) });

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title..."
      />
      {block.pairs.map((pair, index) => (
        <div key={`${pair.left}-${pair.right}-${index}`} className="flex gap-1 rounded border bg-slate-50 p-1">
          <select
            className="rounded border text-xs"
            value={pair.leftType}
            onChange={(e) => {
              onUpdate({
                pairs: updateItemAt(block.pairs, index, (currentPair) => ({
                  ...currentPair,
                  leftType: e.target.value as typeof pair.leftType
                }))
              });
            }}
          >
            <option value="text">TXT</option>
            <option value="image">IMG</option>
          </select>
          <input
            type="text"
            className="flex-1 rounded border p-1 text-xs"
            value={pair.left}
            onChange={(e) => {
              onUpdate({
                pairs: updateItemAt(block.pairs, index, (currentPair) => ({
                  ...currentPair,
                  left: e.target.value
                }))
              });
            }}
            placeholder="Left"
          />
          <input
            type="text"
            className="flex-1 rounded border p-1 text-xs"
            value={pair.right}
            onChange={(e) => {
              onUpdate({
                pairs: updateItemAt(block.pairs, index, (currentPair) => ({
                  ...currentPair,
                  right: e.target.value
                }))
              });
            }}
            placeholder="Right"
          />
          <button
            type="button"
            onClick={() => removePair(index)}
            className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addPair} className="text-xs font-bold text-blue-600">
        + Add Pair
      </button>
    </div>
  );
};

export const VocabularyMatchPreview = ({ block }: BlockPreviewProps<VocabularyMatchBlock>) => {
  const [selectedLeft, setSelectedLeft] = usePersistedPreviewState<string | null>(
    createPreviewStorageKey(block.id, 'vocabulary-match.selected-left'),
    null
  );
  const [matchedPairs, setMatchedPairs] = usePersistedPreviewState<Record<string, string>>(
    createPreviewStorageKey(block.id, 'vocabulary-match.matches'),
    {}
  );
  const [leftItems] = useState(() => shuffleArray(block.pairs, `${block.id}:vocabulary-left`));
  const [rightItems] = useState(() =>
    shuffleArray(
      block.pairs.map((pair) => pair.right),
      `${block.id}:vocabulary-right`
    )
  );

  const handleRightClick = (right: string) => {
    if (!selectedLeft) return;
    setMatchedPairs((prev) => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
  };

  return (
    <div className="my-6 space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
          Connect: {block.title}
        </span>
        <span className="rounded bg-lime-100 px-2 py-0.5 text-[10px] font-bold text-lime-700">
          {Object.keys(matchedPairs).length} / {block.pairs.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {leftItems.map((pair, index) => {
            const matched = Boolean(matchedPairs[pair.left]);
            const selected = selectedLeft === pair.left;

            return (
              <div
                key={`${pair.left}-${index}`}
                onClick={() => !matched && setSelectedLeft(pair.left)}
                className={`relative flex min-h-[58px] cursor-pointer items-center justify-center rounded-xl border p-3 transition-all ${
                  matched
                    ? 'border-slate-300 bg-slate-200 opacity-50'
                    : selected
                      ? 'scale-[1.02] border-lime-500 bg-lime-100 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {pair.leftType === 'image' ? (
                  <img src={pair.left} className="h-14 rounded object-contain" alt="" />
                ) : (
                  <span className="text-sm font-bold">{pair.left}</span>
                )}
                {matched && <span className="absolute right-3 font-bold text-lime-500">OK</span>}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {rightItems.map((right, index) => {
            const matched = Object.values(matchedPairs).includes(right);
            return (
              <div
                key={`${right}-${index}`}
                onClick={() => handleRightClick(right)}
                className={`flex min-h-[58px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-3 transition-all ${
                  matched
                    ? 'border-lime-300 bg-lime-50 text-lime-700'
                    : selectedLeft
                      ? 'border-lime-400 bg-white hover:bg-lime-50'
                      : 'border-slate-300 bg-white'
                }`}
              >
                <span className="text-sm font-bold">{right}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
