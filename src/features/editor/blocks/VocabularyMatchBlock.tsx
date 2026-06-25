import { useMemo, useState } from 'react';
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

type MatchSide = 'left' | 'right';
type MatchItemType = VocabularyMatchBlock['pairs'][number]['leftType'];

type MatchCard = {
  pairId: string;
  side: MatchSide;
  value: string;
  type: MatchItemType;
  label?: string;
  badge: number;
};

const MATCH_TYPE_OPTIONS: Array<{ value: MatchItemType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'audio', label: 'Audio' },
  { value: 'category', label: 'Category' }
];

const VARIANT_CLASS_MAP: Record<NonNullable<VocabularyMatchBlock['variant']>, string> = {
  classic: 'rounded-2xl',
  cards: 'rounded-[28px]',
  'two-column': 'rounded-2xl'
};

const getPromptByType = (side: MatchSide, type: MatchItemType) => {
  if (type === 'image') return `${side === 'left' ? 'Left' : 'Right'} image URL`;
  if (type === 'audio') return `${side === 'left' ? 'Left' : 'Right'} audio URL`;
  return `${side === 'left' ? 'Left' : 'Right'} content`;
};

const getLabelPromptByType = (side: MatchSide, type: MatchItemType) => {
  if (type === 'image') return `${side === 'left' ? 'Left' : 'Right'} caption`;
  if (type === 'audio') return `${side === 'left' ? 'Left' : 'Right'} helper text`;
  return `${side === 'left' ? 'Left' : 'Right'} helper label`;
};

const renderEditorCardContent = (item: MatchCard, compact = false) => {
  if (item.type === 'image') {
    return (
      <div className="flex w-full flex-col gap-2">
        {item.value ? (
          <img
            src={item.value}
            alt={item.label || 'Match item'}
            className={`w-full rounded-xl border border-slate-200 bg-slate-100 object-cover shadow-sm ${compact ? 'h-24 max-w-[180px]' : 'h-28 max-w-[220px]'}`}
          />
        ) : (
          <div className={`flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-[11px] uppercase tracking-[0.16em] text-slate-400 ${compact ? 'h-24 max-w-[180px]' : 'h-28 max-w-[220px]'}`}>
            Add image
          </div>
        )}
        {item.label ? <span className="text-xs font-medium text-slate-500">{item.label}</span> : null}
      </div>
    );
  }

  if (item.type === 'audio') {
    return (
      <div className="flex w-full flex-col gap-2">
        {item.label ? <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</span> : null}
        {item.value ? (
          <audio controls className="w-full">
            <source src={item.value} />
          </audio>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
            Add audio URL
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {item.label ? <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</span> : null}
      <span className="text-sm font-semibold leading-5 text-slate-800">{item.value || 'Empty item'}</span>
    </div>
  );
};

const renderPreviewCardContent = (item: MatchCard) => {
  if (item.type === 'image') {
    return item.value ? (
      <img
        src={item.value}
        alt={item.label || 'Match item'}
        className="h-32 w-full rounded-2xl bg-slate-100 object-cover"
      />
    ) : (
      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-[11px] uppercase tracking-[0.14em] text-slate-400">
        Add image
      </div>
    );
  }

  if (item.type === 'audio') {
    return (
      <div className="space-y-2">
        {item.label ? <div className="text-xs text-slate-500">{item.label}</div> : null}
        {item.value ? (
          <audio controls className="w-full">
            <source src={item.value} />
          </audio>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-sm text-slate-400">
            Add audio URL
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium leading-5 text-slate-800">{item.value || 'Empty item'}</div>
      {item.label ? <div className="text-xs text-slate-500">{item.label}</div> : null}
    </div>
  );
};

const buildCards = (block: VocabularyMatchBlock, side: MatchSide): MatchCard[] =>
  block.pairs.map((pair, index) => ({
    pairId: pair.id,
    side,
    value: side === 'left' ? pair.left : pair.right,
    type: side === 'left' ? pair.leftType : pair.rightType || 'text',
    label: side === 'left' ? pair.leftLabel : pair.rightLabel,
    badge: index + 1
  }));

const getOptionNumber = (
  item: MatchCard,
  index: number,
  showReferenceBadges: VocabularyMatchBlock['showReferenceBadges']
) => (showReferenceBadges === false ? index + 1 : item.badge);

export const VocabularyMatchForm = ({
  block,
  onUpdate
}: BlockFormProps<VocabularyMatchBlock>) => {
  const addPair = () =>
    onUpdate({ pairs: [...block.pairs, createVocabularyPair()] });

  const removePair = (index: number) =>
    onUpdate({ pairs: removeItemAt(block.pairs, index) });

  const updatePair = (
    index: number,
    updater: (
      currentPair: VocabularyMatchBlock['pairs'][number]
    ) => VocabularyMatchBlock['pairs'][number]
  ) =>
    onUpdate({
      pairs: updateItemAt(block.pairs, index, updater)
    });

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title..."
      />
      <textarea
        className="min-h-[72px] w-full rounded border p-2 text-sm"
        value={block.instruction || ''}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction..."
      />
      <div className="grid gap-2 md:grid-cols-2">
        <select
          className="rounded border p-2 text-xs"
          value={block.matchMode || 'word-to-meaning'}
          onChange={(e) => onUpdate({ matchMode: e.target.value as VocabularyMatchBlock['matchMode'] })}
        >
          <option value="text-to-text">Text to text</option>
          <option value="image-to-word">Image to word</option>
          <option value="audio-to-word">Audio to word</option>
          <option value="word-to-meaning">Word to meaning</option>
          <option value="phrase-to-response">Phrase to response</option>
          <option value="category-matching">Category matching</option>
        </select>
        <select
          className="rounded border p-2 text-xs"
          value={block.variant || 'classic'}
          onChange={(e) => onUpdate({ variant: e.target.value as VocabularyMatchBlock['variant'] })}
        >
          <option value="classic">Classic</option>
          <option value="cards">Cards</option>
          <option value="two-column">Two-column</option>
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <label className="flex items-center gap-2 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={block.shuffleLeft ?? false}
            onChange={(e) => onUpdate({ shuffleLeft: e.target.checked })}
          />
          Shuffle left
        </label>
        <label className="flex items-center gap-2 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={block.shuffleRight ?? true}
            onChange={(e) => onUpdate({ shuffleRight: e.target.checked })}
          />
          Shuffle right
        </label>
        <label className="flex items-center gap-2 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={block.showReferenceBadges ?? true}
            onChange={(e) => onUpdate({ showReferenceBadges: e.target.checked })}
          />
          Show numbers
        </label>
        <label className="flex items-center gap-2 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={block.showCorrectMatches ?? false}
            onChange={(e) => onUpdate({ showCorrectMatches: e.target.checked })}
          />
          Show correct matches
        </label>
      </div>
      {block.pairs.map((pair, index) => (
        <div key={pair.id} className="space-y-3 rounded-xl border bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Pair {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removePair(index)}
              className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(['left', 'right'] as const).map((side) => {
              const typeKey = side === 'left' ? 'leftType' : 'rightType';
              const valueKey = side === 'left' ? 'left' : 'right';
              const labelKey = side === 'left' ? 'leftLabel' : 'rightLabel';
              const type = pair[typeKey] || 'text';

              return (
                <div key={side} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {side === 'left' ? 'Left side' : 'Right side'}
                  </div>
                  <select
                    className="w-full rounded border p-2 text-xs"
                    value={type}
                    onChange={(e) =>
                      updatePair(index, (currentPair) => ({
                        ...currentPair,
                        [typeKey]: e.target.value as MatchItemType
                      }))
                    }
                  >
                    {MATCH_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="w-full rounded border p-2 text-xs"
                    value={pair[valueKey]}
                    onChange={(e) =>
                      updatePair(index, (currentPair) => ({
                        ...currentPair,
                        [valueKey]: e.target.value
                      }))
                    }
                    placeholder={getPromptByType(side, type)}
                  />
                  <input
                    type="text"
                    className="w-full rounded border p-2 text-xs"
                    value={pair[labelKey] || ''}
                    onChange={(e) =>
                      updatePair(index, (currentPair) => ({
                        ...currentPair,
                        [labelKey]: e.target.value
                      }))
                    }
                    placeholder={getLabelPromptByType(side, type)}
                  />
                  <div className="pt-1">{renderEditorCardContent(buildCards({ ...block, pairs: [pair] }, side)[0], true)}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button type="button" onClick={addPair} className="text-xs font-bold text-blue-600">
        + Add Pair
      </button>
    </div>
  );
};

export const VocabularyMatchPreview = ({ block }: BlockPreviewProps<VocabularyMatchBlock>) => {
  const variant = block.variant || 'classic';
  const [shuffleRound, setShuffleRound] = useState(0);
  const leftBase = buildCards(block, 'left');
  const rightBase = buildCards(block, 'right');

  const leftItems = useMemo(
    () =>
      block.shuffleLeft
        ? shuffleArray(leftBase, `${block.id}:vocabulary-left:${shuffleRound}`)
        : leftBase,
    [block.id, block.shuffleLeft, leftBase, shuffleRound]
  );
  const rightItems = useMemo(
    () =>
      block.shuffleRight === false
        ? rightBase
        : shuffleArray(rightBase, `${block.id}:vocabulary-right:${shuffleRound}`),
    [block.id, block.shuffleRight, rightBase, shuffleRound]
  );

  const [answers, setAnswers] = usePersistedPreviewState<Record<string, string>>(
    createPreviewStorageKey(block.id, 'vocabulary-match.answers'),
    {}
  );

  const evaluateAnswer = (item: MatchCard) => {
    const typedNumber = answers[item.pairId]?.trim() || '';
    if (!typedNumber) {
      return { typedNumber, hasAnswer: false, isCorrect: false };
    }

    const matchedOption = rightItems.find(
      (option, optionIndex) =>
        String(getOptionNumber(option, optionIndex, block.showReferenceBadges)) === typedNumber
    );

    return {
      typedNumber,
      hasAnswer: true,
      isCorrect: matchedOption?.pairId === item.pairId
    };
  };

  const matchedCount = leftItems.filter((item) => evaluateAnswer(item).isCorrect).length;

  return (
    <div
      className={`my-6 space-y-5 border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm ${VARIANT_CLASS_MAP[variant]}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="space-y-1">
          <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Match Pairs
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
          {block.instruction ? <p className="text-sm leading-6 text-slate-600">{block.instruction}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
            {matchedCount} / {block.pairs.length}
          </span>
          <button
            type="button"
            onClick={() => setShuffleRound((current) => current + 1)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm hover:border-slate-300"
          >
            Reshuffle
          </button>
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm hover:border-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {leftItems.map((item) => {
            const { typedNumber, hasAnswer, isCorrect } = evaluateAnswer(item);
            const showFeedback = block.showCorrectMatches ?? false;

            return (
              <div
                key={item.pairId}
                className={`relative overflow-hidden rounded-[24px] border bg-white p-3 shadow-sm ${
                  showFeedback && isCorrect
                    ? 'border-emerald-300'
                    : showFeedback && hasAnswer
                      ? 'border-amber-300'
                      : 'border-slate-200'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={typedNumber}
                  onChange={(e) =>
                    setAnswers((current) => ({
                      ...current,
                      [item.pairId]: e.target.value.replace(/\D/g, '')
                    }))
                  }
                  placeholder="#"
                  className="absolute left-4 top-4 z-10 h-10 w-10 rounded-xl border border-slate-300 bg-white/96 text-center text-sm font-bold text-slate-700 outline-none transition focus:border-slate-500"
                />
                <div className="pt-3">{renderPreviewCardContent(item)}</div>
                {item.label && item.type === 'image' ? (
                  <div className="pt-2 text-xs text-slate-500">{item.label}</div>
                ) : null}
                {showFeedback ? (
                  <div
                    className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700'
                        : hasAnswer
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {isCorrect ? 'Correct match' : hasAnswer ? 'Incorrect match' : 'Type a number'}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          {rightItems.map((item, index) => (
            <div
              key={item.pairId}
              className="inline-flex min-h-[52px] min-w-[140px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                {getOptionNumber(item, index, block.showReferenceBadges)}
              </span>
              <div className="min-w-0 flex-1">{renderPreviewCardContent(item)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
