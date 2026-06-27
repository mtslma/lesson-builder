import { useMemo } from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import type { BlockFormProps, BlockPreviewProps, VocabularyMatchBlock } from '../types/index';
import { createVocabularyPair } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import { shuffleArray } from '../domain/shuffle';

type MatchMode = NonNullable<VocabularyMatchBlock['matchMode']>;
type Pair = VocabularyMatchBlock['pairs'][number];
type MatchTone = {
  badge: string;
  border: string;
};

// Adicionado classes de borda correspondentes para unificar o design colorido
const MATCH_TONES: MatchTone[] = [
  { badge: 'bg-[#d9f99d]', border: 'border-[#d9f99d] focus:border-[#b5e468]' },
  { badge: 'bg-[#ead5f7]', border: 'border-[#ead5f7] focus:border-[#d6b4ed]' },
  { badge: 'bg-[#bfdbfe]', border: 'border-[#bfdbfe] focus:border-[#93c5fd]' },
  { badge: 'bg-[#fde68a]', border: 'border-[#fde68a] focus:border-[#fcd34d]' },
  { badge: 'bg-[#fecdd3]', border: 'border-[#fecdd3] focus:border-[#fda4af]' },
  { badge: 'bg-[#fbcfe8]', border: 'border-[#fbcfe8] focus:border-[#f9a8d4]' }
];

const MATCH_MODE_OPTIONS: Array<{ value: MatchMode; label: string }> = [
  { value: 'image-to-word', label: 'Images' },
  { value: 'audio-to-word', label: 'Audio' },
  { value: 'word-to-meaning', label: 'Text' }
];

const getResolvedMode = (matchMode?: VocabularyMatchBlock['matchMode']): MatchMode => {
  if (matchMode === 'image-to-word') return 'image-to-word';
  if (matchMode === 'audio-to-word') return 'audio-to-word';
  return 'word-to-meaning';
};

const getModeHelpText = (mode: MatchMode) => {
  if (mode === 'image-to-word') {
    return 'Images appear shuffled on top. Text options stay below in automatic number order.';
  }

  if (mode === 'audio-to-word') {
    return 'Audio prompts stay on the left. Numbered text options stay on the right.';
  }

  return 'A compact two-column layout for words, phrases, meanings, or numbers.';
};

const normalizePairForMode = (pair: Pair, mode: MatchMode): Pair => {
  if (mode === 'image-to-word') {
    return {
      ...pair,
      leftType: 'image',
      rightType: 'text'
    };
  }

  if (mode === 'audio-to-word') {
    return {
      ...pair,
      leftType: 'audio',
      rightType: 'text'
    };
  }

  return {
    ...pair,
    leftType: 'text',
    rightType: 'text'
  };
};

const createPairForMode = (mode: MatchMode): Pair =>
  normalizePairForMode(createVocabularyPair(), mode);

const getRightNumber = (index: number) => String(index + 1);
const getTone = (index: number) => MATCH_TONES[index % MATCH_TONES.length];
const getToneByNumber = (value: string, max: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return null;
  return getTone(parsed - 1);
};
const sanitizeAnswerValue = (rawValue: string, max: number) => {
  const digits = rawValue.replace(/\D/g, '');
  if (!digits) return '';

  const parsed = Number(digits);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return '';

  return String(parsed);
};

const renderImageCard = (
  pair: Pair,
  index: number,
  value: string,
  onChange: (next: string) => void,
  showFeedback: boolean,
  isCorrect: boolean,
  optionCount: number
) => {
  const tone = getToneByNumber(value, optionCount);

  return (
    <div
      key={pair.id}
      className={`mx-auto flex w-full max-w-55 flex-col items-center justify-center gap-2 rounded-[18px] border bg-white p-3 shadow-sm ${
        showFeedback
          ? isCorrect
            ? 'border-emerald-300'
            : value
              ? 'border-amber-300'
              : 'border-slate-200'
          : 'border-slate-200'
      }`}
    >
      {pair.left ? (
        <img
          src={pair.left}
          alt={pair.leftLabel || `Image ${index + 1}`}
          className="h-32 w-full max-w-50 rounded-xl bg-slate-100 object-cover"
        />
      ) : (
        <div className="flex h-32 w-full max-w-50 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-[10px] uppercase tracking-[0.14em] text-slate-400">
          Image
        </div>
      )}
      <div className="flex items-center justify-center w-full mt-1">
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="-"
          className={`h-9 w-9 rounded-full border-2 text-center text-sm font-bold text-slate-800 outline-none transition duration-150 ${
            tone
              ? `${tone.badge} ${tone.border}`
              : 'border-dashed border-slate-300 bg-slate-50 focus:border-solid focus:border-slate-400 focus:bg-white'
          }`}
        />
      </div>
      {pair.leftLabel ? (
        <div className="text-[11px] leading-4 text-slate-500 text-center">{pair.leftLabel}</div>
      ) : null}
    </div>
  );
};

const renderTextOption = (pair: Pair, index: number) => (
  <div
    key={pair.id}
    className="grid min-h-11 grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
  >
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-slate-700 ${getTone(index).badge}`}
    >
      {getRightNumber(index)}
    </span>
    <div className="min-w-0">
      <div className="font-medium leading-4 text-slate-800">{pair.right || 'Option'}</div>
      {pair.rightLabel ? <div className="text-[11px] text-slate-500">{pair.rightLabel}</div> : null}
    </div>
  </div>
);

const renderAudioPrompt = (
  pair: Pair,
  value: string,
  onChange: (next: string) => void,
  showFeedback: boolean,
  isCorrect: boolean,
  optionCount: number
) => {
  const tone = getToneByNumber(value, optionCount);

  return (
    <div
      key={pair.id}
      className={`grid min-h-18 items-stretch gap-3 rounded-lg border bg-white px-3 py-2 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] ${
        showFeedback
          ? isCorrect
            ? 'border-emerald-300'
            : value
              ? 'border-amber-300'
              : 'border-slate-200'
          : 'border-slate-200'
      }`}
    >
      <div className="flex min-w-0">
        {pair.left ? (
          <div className="flex min-h-14 w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            {pair.leftLabel ? (
              <div className="mr-3 max-w-30 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {pair.leftLabel}
              </div>
            ) : null}
            <audio controls className="h-9 min-w-0 flex-1">
              <source src={pair.left} />
            </audio>
          </div>
        ) : (
          <div className="flex min-h-14 w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-center text-sm text-slate-400">
            Add audio URL
          </div>
        )}
      </div>
      <div className="flex min-h-14 h-full items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="-"
          className={`h-9 w-9 rounded-full border-2 text-center text-sm font-bold text-slate-800 outline-none transition duration-150 ${
            tone
              ? `${tone.badge} ${tone.border}`
              : 'border-dashed border-slate-300 bg-white focus:border-solid focus:border-slate-400'
          }`}
        />
      </div>
      <div className="flex min-w-0">
        <div className="flex min-h-14 w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-4 text-slate-800">
          <div className="min-w-0">
            {pair.right || 'Option'}
            {pair.rightLabel ? (
              <div className="mt-1 text-[11px] text-slate-500">{pair.rightLabel}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderAlignedTextPrompt = (
  pair: Pair,
  value: string,
  onChange: (next: string) => void,
  showFeedback: boolean,
  isCorrect: boolean,
  optionCount: number
) => {
  const tone = getToneByNumber(value, optionCount);

  return (
    <div
      key={pair.id}
      className={`grid min-h-18 items-stretch gap-3 rounded-lg border bg-white px-3 py-2 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] ${
        showFeedback
          ? isCorrect
            ? 'border-emerald-300'
            : value
              ? 'border-amber-300'
              : 'border-slate-200'
          : 'border-slate-200'
      }`}
    >
      <div className="flex min-w-0">
        <div className="flex min-h-14 w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-4 text-slate-800">
          <div className="min-w-0">
            {pair.left || 'Empty item'}
            {pair.leftLabel ? (
              <div className="mt-1 text-[11px] text-slate-500">{pair.leftLabel}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex min-h-14 h-full items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="-"
          className={`h-9 w-9 rounded-full border-2 text-center text-sm font-bold text-slate-800 outline-none transition duration-150 ${
            tone
              ? `${tone.badge} ${tone.border}`
              : 'border-dashed border-slate-300 bg-white focus:border-solid focus:border-slate-400'
          }`}
        />
      </div>
      <div className="flex min-w-0">
        <div className="flex min-h-14 w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-4 text-slate-800">
          <div className="min-w-0">
            {pair.right || 'Option'}
            {pair.rightLabel ? (
              <div className="mt-1 text-[11px] text-slate-500">{pair.rightLabel}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VocabularyMatchForm = ({ block, onUpdate }: BlockFormProps<VocabularyMatchBlock>) => {
  const mode = getResolvedMode(block.matchMode);

  const updateMode = (nextMode: MatchMode) =>
    onUpdate({
      matchMode: nextMode,
      pairs: block.pairs.map((pair) => normalizePairForMode(pair, nextMode))
    });

  const addPair = () => onUpdate({ pairs: [...block.pairs, createPairForMode(mode)] });

  const removePair = (index: number) => onUpdate({ pairs: removeItemAt(block.pairs, index) });

  const updatePair = (index: number, updater: (currentPair: Pair) => Pair) =>
    onUpdate({
      pairs: updateItemAt(block.pairs, index, (currentPair) =>
        normalizePairForMode(updater(currentPair), mode)
      )
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
        className="min-h-18 w-full rounded border p-2 text-sm"
        value={block.instruction || ''}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction..."
      />
      <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)]">
        <select
          className="rounded border p-2 text-xs"
          value={mode}
          onChange={(e) => updateMode(e.target.value as MatchMode)}
        >
          {MATCH_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {getModeHelpText(mode)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onUpdate({
              shuffleVersion: (block.shuffleVersion || 0) + 1
            })
          }
          className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
        >
          Shuffle Options
        </button>
        <span className="text-xs text-slate-500">Reorders the numbered options in preview.</span>
      </div>
      <label className="flex items-center gap-2 rounded border bg-slate-50 px-3 py-2 text-xs text-slate-700">
        <input
          type="checkbox"
          checked={block.showCorrectMatches ?? false}
          onChange={(e) => onUpdate({ showCorrectMatches: e.target.checked })}
        />
        Show answer feedback in preview
      </label>

      <div className="space-y-2">
        {block.pairs.map((pair, index) => (
          <div
            key={pair.id}
            className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <div className="flex items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500">
              {index + 1}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                className="w-full rounded border p-2 text-xs"
                value={pair.left}
                onChange={(e) =>
                  updatePair(index, (currentPair) => ({
                    ...currentPair,
                    left: e.target.value
                  }))
                }
                placeholder={
                  mode === 'image-to-word'
                    ? 'Image URL'
                    : mode === 'audio-to-word'
                      ? 'Audio URL'
                      : 'Left text'
                }
              />
              <input
                type="text"
                className="w-full rounded border p-2 text-xs"
                value={pair.leftLabel || ''}
                onChange={(e) =>
                  updatePair(index, (currentPair) => ({
                    ...currentPair,
                    leftLabel: e.target.value
                  }))
                }
                placeholder={
                  mode === 'image-to-word'
                    ? 'Optional caption'
                    : mode === 'audio-to-word'
                      ? 'Optional audio label'
                      : 'Optional helper label'
                }
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                className="w-full rounded border p-2 text-xs"
                value={pair.right}
                onChange={(e) =>
                  updatePair(index, (currentPair) => ({
                    ...currentPair,
                    right: e.target.value
                  }))
                }
                placeholder={mode === 'audio-to-word' ? 'Answer text' : 'Right text'}
              />
              <input
                type="text"
                className="w-full rounded border p-2 text-xs"
                value={pair.rightLabel || ''}
                onChange={(e) =>
                  updatePair(index, (currentPair) => ({
                    ...currentPair,
                    rightLabel: e.target.value
                  }))
                }
                placeholder="Optional helper label"
              />
            </div>
            <button
              type="button"
              onClick={() => removePair(index)}
              className="rounded border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addPair} className="text-xs font-bold text-blue-600">
        + Add Pair
      </button>
    </div>
  );
};

export const VocabularyMatchPreview = ({ block }: BlockPreviewProps<VocabularyMatchBlock>) => {
  const mode = getResolvedMode(block.matchMode);
  const [answers, setAnswers] = usePersistedPreviewState<Record<string, string>>(
    createPreviewStorageKey(block.id, 'vocabulary-match.answers'),
    {}
  );

  const normalizedPairs = useMemo(
    () => block.pairs.map((pair) => normalizePairForMode(pair, mode)),
    [block.pairs, mode]
  );

  const leftPairs = useMemo(() => {
    if (mode === 'image-to-word') {
      return shuffleArray(
        normalizedPairs,
        `${block.id}:vocabulary-left:${block.shuffleVersion || 0}`
      );
    }

    return normalizedPairs;
  }, [block.id, block.shuffleVersion, mode, normalizedPairs]);

  const rightPairs = useMemo(() => {
    if (mode === 'image-to-word' || mode === 'audio-to-word' || mode === 'word-to-meaning') {
      return shuffleArray(
        normalizedPairs,
        `${block.id}:vocabulary-right:${block.shuffleVersion || 0}`
      );
    }

    return normalizedPairs;
  }, [block.id, block.shuffleVersion, mode, normalizedPairs]);

  const matchedCount = normalizedPairs.filter((pair) => {
    const typedValue = answers[pair.id]?.trim();
    if (!typedValue) return false;
    const selectedPair = rightPairs[Number(typedValue) - 1];
    return selectedPair?.id === pair.id;
  }).length;

  return (
    <div className="my-6 space-y-5 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="space-y-1">
          <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Match Pairs
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
          {block.instruction ? (
            <p className="text-sm leading-6 text-slate-600">{block.instruction}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
            {matchedCount} / {normalizedPairs.length}
          </span>
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm hover:border-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      {mode === 'image-to-word' ? (
        <div className="space-y-4">
          <div className="grid justify-items-center gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {leftPairs.map((pair, index) => {
              const typedValue = answers[pair.id] || '';
              const selectedPair = rightPairs[Number(typedValue) - 1];
              const isCorrect = Boolean(typedValue) && selectedPair?.id === pair.id;

              return renderImageCard(
                pair,
                index,
                typedValue,
                (next) =>
                  setAnswers((current) => ({
                    ...current,
                    [pair.id]: sanitizeAnswerValue(next, rightPairs.length)
                  })),
                block.showCorrectMatches ?? false,
                isCorrect,
                rightPairs.length
              );
            })}
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {rightPairs.map((pair, index) => renderTextOption(pair, index))}
          </div>
        </div>
      ) : null}

      {mode === 'audio-to-word' ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {normalizedPairs.map((pair) => {
              const typedValue = answers[pair.id] || '';
              const selectedPair = rightPairs[Number(typedValue) - 1];
              const isCorrect = Boolean(typedValue) && selectedPair?.id === pair.id;

              return renderAudioPrompt(
                pair,
                typedValue,
                (next) =>
                  setAnswers((current) => ({
                    ...current,
                    [pair.id]: sanitizeAnswerValue(next, rightPairs.length)
                  })),
                block.showCorrectMatches ?? false,
                isCorrect,
                rightPairs.length
              );
            })}
          </div>
          <div className="space-y-2">
            {rightPairs.map((pair, index) => renderTextOption(pair, index))}
          </div>
        </div>
      ) : null}

      {mode !== 'image-to-word' && mode !== 'audio-to-word' ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {normalizedPairs.map((pair) => {
              const typedValue = answers[pair.id] || '';
              const selectedPair = rightPairs[Number(typedValue) - 1];
              const isCorrect = Boolean(typedValue) && selectedPair?.id === pair.id;
              return renderAlignedTextPrompt(
                pair,
                typedValue,
                (next) =>
                  setAnswers((current) => ({
                    ...current,
                    [pair.id]: sanitizeAnswerValue(next, rightPairs.length)
                  })),
                block.showCorrectMatches ?? false,
                isCorrect,
                rightPairs.length
              );
            })}
          </div>
          <div className="space-y-2">
            {rightPairs.map((pair, index) => renderTextOption(pair, index))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
