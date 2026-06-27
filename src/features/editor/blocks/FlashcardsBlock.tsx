import { useEffect, useState } from 'react';
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

const renderInlineBold = (text: string) =>
  text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });

const renderRichTextLines = (text: string, className: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p key={index} className={className}>
        {renderInlineBold(line)}
      </p>
    ));

const compactFieldClass = 'w-full rounded border p-2 text-xs';

const IMAGE_FIT_OPTIONS: Array<{ value: NonNullable<Flashcard['imageFit']>; label: string }> = [
  { value: 'cover', label: 'Fill area' },
  { value: 'contain', label: 'Show full image' }
];

const IMAGE_FRAME_OPTIONS: Array<{
  value: NonNullable<Flashcard['imageFrame']>;
  label: string;
}> = [
  { value: 'banner', label: 'Banner' },
  { value: 'rounded-rect', label: 'Rounded rectangle' },
  { value: 'square', label: 'Square' }
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const FlashcardsForm = ({ block, onUpdate }: BlockFormProps<FlashcardsBlock>) => {
  const [editorCardIndex, setEditorCardIndex] = useState(0);

  useEffect(() => {
    setEditorCardIndex((current) => Math.min(current, Math.max(0, block.cards.length - 1)));
  }, [block.cards.length]);

  const addCard = () => {
    onUpdate({
      cards: [...block.cards, createFlashcard()]
    });
    setEditorCardIndex(block.cards.length);
  };

  const removeCard = (index: number) => {
    onUpdate({ cards: removeItemAt(block.cards, index) });
    setEditorCardIndex((current) => Math.max(0, Math.min(current, block.cards.length - 2)));
  };

  const currentCard = block.cards[editorCardIndex];

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <input
          type="text"
          className="w-full rounded border p-2 text-sm font-bold"
          value={block.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Deck Title"
        />
        <select
          className="w-full rounded border p-2 text-sm"
          value={block.variant || 'grid'}
          onChange={(e) => onUpdate({ variant: e.target.value as FlashcardsBlock['variant'] })}
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
          <option value="carousel">Carousel</option>
          <option value="study">Study mode</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="text"
          className="w-full rounded border p-2 text-sm"
          value={block.category || ''}
          onChange={(e) => onUpdate({ category: e.target.value })}
          placeholder="Category"
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
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Card editor
            </span>
            <span className="text-xs text-slate-400">
              {block.cards.length === 0
                ? 'No cards yet.'
                : `Card ${editorCardIndex + 1} of ${block.cards.length}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditorCardIndex((current) => Math.max(0, current - 1))}
              disabled={editorCardIndex === 0}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setEditorCardIndex((current) => Math.min(block.cards.length - 1, current + 1))
              }
              disabled={editorCardIndex >= block.cards.length - 1}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 disabled:opacity-40"
            >
              Next
            </button>
            <button
              type="button"
              onClick={addCard}
              className="rounded border border-sky-200 bg-white px-2 py-1 text-[10px] font-semibold text-sky-600"
            >
              + Add card
            </button>
          </div>
        </div>

        {currentCard && (
          <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Current card
              </span>
              <button
                type="button"
                onClick={() => removeCard(editorCardIndex)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <textarea
                  className="min-h-[68px] w-full rounded border p-2 text-xs font-semibold"
                  value={currentCard.expressions.join('\n')}
                  onChange={(e) => {
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        expressions: e.target.value.split('\n')
                      }))
                    });
                  }}
                  placeholder="Expressions, one per line"
                />

                <textarea
                  className="min-h-[64px] w-full rounded border border-lime-200 bg-lime-50 p-2 text-xs text-lime-800"
                  value={currentCard.shortMeaning || currentCard.backText}
                  onChange={(e) => {
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        shortMeaning: e.target.value,
                        backText: e.target.value
                      }))
                    });
                  }}
                  placeholder="Short meaning"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    className={compactFieldClass}
                    value={currentCard.translation || ''}
                    onChange={(e) =>
                      onUpdate({
                        cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                          ...card,
                          translation: e.target.value
                        }))
                      })
                    }
                    placeholder="Translation"
                  />
                  <input
                    type="text"
                    className={compactFieldClass}
                    value={currentCard.audioUrl || ''}
                    onChange={(e) =>
                      onUpdate({
                        cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                          ...card,
                          audioUrl: e.target.value
                        }))
                      })
                    }
                    placeholder="Audio URL"
                  />
                </div>

                <textarea
                  className="min-h-[64px] w-full rounded border p-2 text-xs"
                  value={currentCard.exampleSentence || ''}
                  onChange={(e) =>
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        exampleSentence: e.target.value
                      }))
                    })
                  }
                  placeholder="Example sentence"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Image
                </div>
                <input
                  type="text"
                  className={compactFieldClass}
                  value={currentCard.frontImage || currentCard.backImage || ''}
                  onChange={(e) =>
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        backImage: e.target.value
                      }))
                    })
                  }
                  placeholder="Image URL"
                />

                <select
                  className={compactFieldClass}
                  value={currentCard.imageFrame || 'rounded-rect'}
                  onChange={(e) =>
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        imageFrame: e.target.value as Flashcard['imageFrame']
                      }))
                    })
                  }
                >
                  {IMAGE_FRAME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Frame: {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className={compactFieldClass}
                  value={currentCard.imageFit || 'cover'}
                  onChange={(e) =>
                    onUpdate({
                      cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                        ...card,
                        imageFit: e.target.value as Flashcard['imageFit']
                      }))
                    })
                  }
                >
                  {IMAGE_FIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Image mode: {option.label}
                    </option>
                  ))}
                </select>

                <label className="block text-[11px] text-slate-600">
                  Zoom: {Math.round(currentCard.imageZoom || 100)}%
                  <input
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={currentCard.imageZoom || 100}
                    onChange={(e) =>
                      onUpdate({
                        cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                          ...card,
                          imageZoom: clamp(Number(e.target.value), 50, 200)
                        }))
                      })
                    }
                    className="mt-1 w-full"
                  />
                </label>

                <label className="block text-[11px] text-slate-600">
                  Horizontal: {Math.round(currentCard.imagePositionX || 50)}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={currentCard.imagePositionX || 50}
                    onChange={(e) =>
                      onUpdate({
                        cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                          ...card,
                          imagePositionX: clamp(Number(e.target.value), 0, 100)
                        }))
                      })
                    }
                    className="mt-1 w-full"
                  />
                </label>

                <label className="block text-[11px] text-slate-600">
                  Vertical: {Math.round(currentCard.imagePositionY || 50)}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={currentCard.imagePositionY || 50}
                    onChange={(e) =>
                      onUpdate({
                        cards: updateItemAt(block.cards, editorCardIndex, (card) => ({
                          ...card,
                          imagePositionY: clamp(Number(e.target.value), 0, 100)
                        }))
                      })
                    }
                    className="mt-1 w-full"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
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
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCurrentCardIndex(0);
    setCurrentExpressionIndex(0);
  }, [block.id, block.cards.length, setCurrentCardIndex, setCurrentExpressionIndex]);

  if (block.cards.length === 0) return null;

  const currentCard = block.cards[Math.min(currentCardIndex, block.cards.length - 1)];
  const expressions = getCardExpressions(currentCard);
  const currentExpression = expressions[Math.min(currentExpressionIndex, expressions.length - 1)];
  const imageFrame = currentCard.imageFrame || 'rounded-rect';
  const hasImage = Boolean(currentCard.backImage?.trim().length);
  const hasSupportContent = Boolean(currentCard.exampleSentence) || Boolean(currentCard.audioUrl);
  const imageIdentity = `${currentCard.id}:${currentCard.backImage || ''}:${currentExpressionIndex}`;

  useEffect(() => {
    setImageLoaded(!hasImage);
  }, [imageIdentity, hasImage]);

  const goToCard = (nextIndex: number) => {
    setCurrentCardIndex(nextIndex);
    setCurrentExpressionIndex(0);
  };

  const goToExpression = (nextIndex: number) => {
    setCurrentExpressionIndex(nextIndex);
  };

  const imageFrameClass =
    imageFrame === 'banner'
      ? 'h-[84px] w-[80%] rounded-xl'
      : imageFrame === 'square'
        ? 'aspect-square w-[44%] max-w-[152px] rounded-2xl'
        : 'h-[84px] w-[44%] max-w-[152px] rounded-2xl';
  const isBannerFrame = imageFrame === 'banner';

  return (
    <div className="my-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {currentCardIndex + 1} / {block.cards.length}
        </span>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => goToCard(Math.max(0, currentCardIndex - 1))}
              disabled={currentCardIndex === 0}
              className="absolute left-4 top-1/2 z-30 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-lg transition hover:scale-105 disabled:opacity-35"
              aria-label="Previous card"
            >
              <ChevronIcon className="h-5 w-5 rotate-180" />
            </button>

            <button
              type="button"
              onClick={() => goToCard(Math.min(block.cards.length - 1, currentCardIndex + 1))}
              disabled={currentCardIndex === block.cards.length - 1}
              className="absolute right-4 top-1/2 z-30 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-lg transition hover:scale-105 disabled:opacity-35"
              aria-label="Next card"
            >
              <ChevronIcon className="h-5 w-5" />
            </button>

            {hasImage ? (
              <div className="flex flex-col items-center text-center">
                <div className={`flex w-full items-center justify-center overflow-hidden ${isBannerFrame ? 'min-h-[84px]' : 'min-h-[84px]'}`}>
                  <div
                    className={`${imageFrameClass} overflow-hidden border border-slate-100 bg-white`}
                  >
                    {!imageLoaded && <div className="h-full w-full animate-pulse bg-slate-200" />}
                    <img
                      key={imageIdentity}
                      src={currentCard.backImage}
                      alt=""
                      className={`h-full w-full ${
                        currentCard.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                      } ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
                      style={{
                        objectPosition: `${currentCard.imagePositionX ?? 50}% ${currentCard.imagePositionY ?? 50}%`,
                        transformOrigin: 'center center',
                        transform: `scale(${(currentCard.imageZoom ?? 100) / 100})`
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xl font-semibold text-slate-900">{currentExpression}</p>
                  {currentCard.shortMeaning && (
                    <div className="mt-2 space-y-1">
                      {renderRichTextLines(currentCard.shortMeaning, 'text-sm text-slate-600')}
                    </div>
                  )}
                  {currentCard.translation && (
                    <p className="mt-1 text-sm text-slate-500">{currentCard.translation}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[128px] flex-col items-center justify-center text-center">
                <p className="text-[1.45rem] font-semibold tracking-tight text-slate-900">
                  {currentExpression}
                </p>
                {currentCard.shortMeaning && (
                  <div className="mt-3 max-w-xl space-y-1">
                    {renderRichTextLines(currentCard.shortMeaning, 'text-sm text-slate-600')}
                  </div>
                )}
                {currentCard.translation && (
                  <p className="mt-1 max-w-xl text-sm text-slate-500">{currentCard.translation}</p>
                )}
              </div>
            )}

            {hasSupportContent && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left">
                {currentCard.exampleSentence && (
                  <p className="text-sm text-slate-700">{currentCard.exampleSentence}</p>
                )}
                {currentCard.audioUrl && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <audio controls className="flashcard-audio w-full">
                      <source src={currentCard.audioUrl} />
                    </audio>
                  </div>
                )}
              </div>
            )}

            {expressions.length > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {expressions.map((expression, index) => (
                  <button
                    key={`${currentCard.id}-${index}`}
                    type="button"
                    onClick={() => goToExpression(index)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                      index === currentExpressionIndex
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    aria-label={`Expression ${index + 1}`}
                    title={expression}
                  >
                    #{index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
