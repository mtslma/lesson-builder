import { useState } from 'react';
import type { BlockFormProps, BlockPreviewProps, FlashcardsBlock } from '../types/index';

export const FlashcardsForm = ({ block, onUpdate }: BlockFormProps<FlashcardsBlock>) => {
  const addCard = () =>
    onUpdate({
      cards: [
        ...block.cards,
        { id: crypto.randomUUID(), frontText: '', frontImage: '', backText: '', backImage: '' }
      ]
    });

  const removeCard = (index: number) =>
    onUpdate({ cards: block.cards.filter((_, cardIndex) => cardIndex !== index) });

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Deck Title"
      />
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.category || ''}
        onChange={(e) => onUpdate({ category: e.target.value })}
        placeholder="Category (optional)"
      />
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={(block.tags || []).join(', ')}
        onChange={(e) =>
          onUpdate({
            tags: e.target.value
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          })
        }
        placeholder="Tags (comma separated)"
      />
      {block.cards.map((card, index) => (
        <div key={card.id} className="space-y-1 rounded border bg-slate-50 p-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeCard(index)}
              className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            className="w-full rounded border p-1.5 text-xs font-bold"
            value={card.frontText || ''}
            onChange={(e) => {
              const nextCards = [...block.cards];
              nextCards[index].frontText = e.target.value;
              onUpdate({ cards: nextCards });
            }}
            placeholder="Front Text"
          />
          <input
            type="text"
            className="w-full rounded border p-1.5 text-xs"
            value={card.frontImage || ''}
            onChange={(e) => {
              const nextCards = [...block.cards];
              nextCards[index].frontImage = e.target.value;
              onUpdate({ cards: nextCards });
            }}
            placeholder="Front Image URL"
          />
          <input
            type="text"
            className="w-full rounded border p-1.5 text-xs text-lime-700 bg-lime-50"
            value={card.backText}
            onChange={(e) => {
              const nextCards = [...block.cards];
              nextCards[index].backText = e.target.value;
              onUpdate({ cards: nextCards });
            }}
            placeholder="Back Text"
          />
          <input
            type="text"
            className="w-full rounded border p-1.5 text-xs"
            value={card.backImage || ''}
            onChange={(e) => {
              const nextCards = [...block.cards];
              nextCards[index].backImage = e.target.value;
              onUpdate({ cards: nextCards });
            }}
            placeholder="Back Image URL"
          />
        </div>
      ))}
      <button type="button" onClick={addCard} className="text-xs font-bold text-blue-600">
        + Add Card
      </button>
    </div>
  );
};

export const FlashcardsPreview = ({ block }: BlockPreviewProps<FlashcardsBlock>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (block.cards.length === 0) return null;

  const currentCard = block.cards[currentIndex];

  return (
    <div className="my-6 space-y-4 rounded-2xl border bg-slate-50 p-6 text-center shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
            {block.title}
          </span>
          {(block.category || (block.tags || []).length > 0) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {block.category && (
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {block.category}
                </span>
              )}
              {(block.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="font-mono text-xs">
          {currentIndex + 1} / {block.cards.length}
        </span>
      </div>
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective mx-auto h-44 w-full max-w-[320px] cursor-pointer"
      >
        <div
          className={`relative h-full w-full transform-style duration-300 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-white p-4 backface-hidden shadow-xs">
            {currentCard.frontImage && (
              <img
                src={currentCard.frontImage}
                alt=""
                className="mb-3 max-h-24 rounded-lg object-cover"
              />
            )}
            {currentCard.frontText && (
              <p className="font-serif text-base font-bold">{currentCard.frontText}</p>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-slate-900 p-4 text-lime-400 backface-hidden rotate-y-180 shadow-md">
            {currentCard.backImage && (
              <img
                src={currentCard.backImage}
                alt=""
                className="mb-3 max-h-24 rounded-lg object-cover"
              />
            )}
            {currentCard.backText && (
              <p className="font-sans text-sm font-bold">{currentCard.backText}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex((previous) => previous - 1);
            setIsFlipped(false);
          }}
          className="rounded-md border bg-white px-3 py-1 text-xs font-bold disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={currentIndex === block.cards.length - 1}
          onClick={() => {
            setCurrentIndex((previous) => previous + 1);
            setIsFlipped(false);
          }}
          className="rounded-md border bg-white px-3 py-1 text-xs font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};
