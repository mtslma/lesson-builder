import { useEffect } from 'react';
import { ChevronIcon } from '../components/ChevronIcon';
import { createPreviewStorageKey } from '../domain/previewState';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import type { BlockFormProps, BlockPreviewProps, FlashcardsBlock } from '../types/index';
import { createFlashcard } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';

type Flashcard = FlashcardsBlock['cards'][number];

const getCardExpressions = (card: Flashcard) => {
  const expressions = card.expressions.filter((expression) => expression.trim().length > 0);
  return expressions.length > 0 ? expressions : [''];
};

export const FlashcardsForm = ({ block, onUpdate }: BlockFormProps<FlashcardsBlock>) => {
  const addCard = () =>
    onUpdate({
      cards: [...block.cards, createFlashcard()]
    });

  const removeCard = (index: number) => onUpdate({ cards: removeItemAt(block.cards, index) });

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
        <div key={card.id} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Card {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeCard(index)}
              className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>

          <textarea
            className="h-24 w-full rounded border p-2 text-xs font-bold"
            value={card.expressions.join('\n')}
            onChange={(e) => {
              onUpdate({
                cards: updateItemAt(block.cards, index, (currentCard) => ({
                  ...currentCard,
                  expressions: e.target.value.split('\n')
                }))
              });
            }}
            placeholder="Expressions, one per line"
          />

          <textarea
            className="h-20 w-full rounded border border-lime-200 bg-lime-50 p-2 text-xs text-lime-800"
            value={card.backText}
            onChange={(e) => {
              onUpdate({
                cards: updateItemAt(block.cards, index, (currentCard) => ({
                  ...currentCard,
                  backText: e.target.value
                }))
              });
            }}
            placeholder="Meaning or example"
          />

          <input
            type="text"
            className="w-full rounded border p-1.5 text-xs"
            value={card.backImage || ''}
            onChange={(e) => {
              onUpdate({
                cards: updateItemAt(block.cards, index, (currentCard) => ({
                  ...currentCard,
                  backImage: e.target.value
                }))
              });
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
  const [currentCardIndex, setCurrentCardIndex] = usePersistedPreviewState<number>(
    createPreviewStorageKey(block.id, 'flashcards.card-index'),
    0
  );
  const [currentExpressionIndex, setCurrentExpressionIndex] = usePersistedPreviewState<number>(
    createPreviewStorageKey(block.id, 'flashcards.expression-index'),
    0
  );

  useEffect(() => {
    setCurrentCardIndex(0);
    setCurrentExpressionIndex(0);
  }, [block.id, block.cards.length]);

  if (block.cards.length === 0) return null;

  const currentCard = block.cards[Math.min(currentCardIndex, block.cards.length - 1)];
  const expressions = getCardExpressions(currentCard);
  const currentExpression = expressions[Math.min(currentExpressionIndex, expressions.length - 1)];
  const hasMeaningContent =
    currentCard.backText.trim().length > 0 || Boolean(currentCard.backImage?.trim().length);

  const goToCard = (nextIndex: number) => {
    setCurrentCardIndex(nextIndex);
    setCurrentExpressionIndex(0);
  };

  const goToExpression = (nextIndex: number) => {
    setCurrentExpressionIndex(nextIndex);
  };

  return (
    <div className="my-6 space-y-4 rounded-2xl border bg-slate-50 p-6 text-center shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="text-left">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
        <span className="font-mono text-xs text-slate-600">
          {currentCardIndex + 1} / {block.cards.length}
        </span>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-6">
            <p className="font-serif text-xl font-bold text-slate-900">{currentExpression}</p>
          </div>

          {hasMeaningContent && (
            <div className="mt-4 rounded-xl border border-lime-100 bg-lime-50 px-5 py-4 text-left">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lime-700">
                Meaning / Example
              </div>
              {currentCard.backImage && (
                <img
                  src={currentCard.backImage}
                  alt=""
                  className="mt-3 h-32 w-full rounded-xl object-cover"
                />
              )}
              {currentCard.backText.trim().length > 0 && (
                <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700">
                  {currentCard.backText}
                </p>
              )}
            </div>
          )}

          {expressions.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {expressions.map((expression, index) => (
                <button
                  key={`${currentCard.id}-${index}`}
                  type="button"
                  onClick={() => goToExpression(index)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    index === currentExpressionIndex
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={expression}
                >
                  Expr. {index + 1}
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => goToCard(Math.max(0, currentCardIndex - 1))}
              disabled={currentCardIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
            >
              <ChevronIcon className="h-4 w-4 rotate-180" />
              Prev card
            </button>
            <button
              type="button"
              onClick={() => goToCard(Math.min(block.cards.length - 1, currentCardIndex + 1))}
              disabled={currentCardIndex === block.cards.length - 1}
              className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
            >
              Next card
              <ChevronIcon className="h-4 w-4" />
            </button>
          </div>

          {expressions.length > 1 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => goToExpression(Math.max(0, currentExpressionIndex - 1))}
                disabled={currentExpressionIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                <ChevronIcon className="h-4 w-4 rotate-180" />
                Prev expression
              </button>
              <button
                type="button"
                onClick={() =>
                  goToExpression(Math.min(expressions.length - 1, currentExpressionIndex + 1))
                }
                disabled={currentExpressionIndex === expressions.length - 1}
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                Next expression
                <ChevronIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
