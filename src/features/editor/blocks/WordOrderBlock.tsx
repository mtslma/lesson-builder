import { removeItemAt, updateItemAt } from '../domain/collections';
import { createWordOrderItem } from '../domain/blockDefaults';
import type { BlockFormProps, BlockPreviewProps, WordOrderBlock } from '../types/index';

const splitSentenceIntoTokens = (sentence: string) =>
  sentence
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

const createShuffledTokens = (sentence: string) => {
  const tokens = splitSentenceIntoTokens(sentence);
  if (tokens.length <= 1) return tokens;

  const seed = sentence.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  const shuffled = tokens
    .map((token, index) => ({
      token,
      weight: ((seed + 1) * (index + 3) * 17) % 997
    }))
    .sort((left, right) => left.weight - right.weight)
    .map((entry) => entry.token);

  const isSameOrder = shuffled.every((token, index) => token === tokens[index]);
  if (isSameOrder) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
};

export const WordOrderForm = ({ block, onUpdate }: BlockFormProps<WordOrderBlock>) => (
  <div className="space-y-3">
    <input className="w-full rounded border p-2 text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Word order title" />
    <textarea className="min-h-[70px] w-full rounded border p-2 text-sm" value={block.instruction} onChange={(e) => onUpdate({ instruction: e.target.value })} placeholder="Instruction" />
    {(block.items || []).map((item, index) => (
      <div key={item.id} className="space-y-2 rounded border bg-slate-50 p-3">
        <input className="w-full rounded border p-2 text-xs" value={item.prompt} onChange={(e) => onUpdate({ items: updateItemAt(block.items, index, (current) => ({ ...current, prompt: e.target.value })) })} placeholder="Prompt" />
        <textarea
          className="min-h-[70px] w-full rounded border p-2 text-xs"
          value={item.sentence}
          onChange={(e) =>
            onUpdate({
              items: updateItemAt(block.items, index, (current) => ({
                ...current,
                sentence: e.target.value
              }))
            })
          }
          placeholder="Write the sentence in the correct order"
        />
        <button type="button" onClick={() => onUpdate({ items: removeItemAt(block.items, index) })} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => onUpdate({ items: [...block.items, createWordOrderItem()] })} className="text-xs font-bold text-blue-600">+ Add item</button>
  </div>
);

export const WordOrderPreview = ({ block }: BlockPreviewProps<WordOrderBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{block.instruction}</p>
    <div className="mt-4 space-y-4">
      {block.items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-medium text-slate-800">{item.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {createShuffledTokens(item.sentence).map((token, index) => (
              <span key={`${item.id}-${index}`} className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700">
                {token}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
