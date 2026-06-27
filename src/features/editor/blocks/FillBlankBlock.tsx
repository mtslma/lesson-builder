import { useMemo } from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import type { BlockFormProps, BlockPreviewProps, FillBlankBlock } from '../types/index';

const GAP_TOKEN = '[]';
const COLUMN_BREAK_TOKEN = '[[column]]';
const LEVEL_BREAK_TOKEN = '[[level]]';

const countPlaceholders = (text: string) => (text.match(/\[\]/g) || []).length;

const syncGapsWithText = (block: FillBlankBlock, text: string): FillBlankBlock['gaps'] => {
  const placeholderCount = countPlaceholders(text);

  return Array.from({ length: placeholderCount }, (_, index) => {
    const existingGap = block.gaps[index];

    return {
      id: existingGap?.id || `gap${index + 1}`,
      acceptedAnswers: existingGap?.acceptedAnswers || [],
      suggestions: existingGap?.suggestions,
      hint: existingGap?.hint,
      caseSensitive: existingGap?.caseSensitive ?? false
    };
  });
};

const normalizeListInput = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const getSharedSuggestionsInput = (gaps: FillBlankBlock['gaps']) =>
  getUniqueSuggestions(gaps).join('\n');

const getUniqueSuggestions = (gaps: FillBlankBlock['gaps']) =>
  Array.from(
    new Set(
      gaps.flatMap((gap) =>
        [...(gap.suggestions || []), ...(gap.acceptedAnswers || [])]
          .map((suggestion) => suggestion.trim())
          .filter(Boolean)
      )
    )
  );

const getGapWidthStyle = (
  gaps: FillBlankBlock['gaps'],
  index: number,
  gapSize: FillBlankBlock['gapSize']
) => {
  const options = [...(gaps[index]?.suggestions || []), ...(gaps[index]?.acceptedAnswers || [])]
    .map((value) => value.trim())
    .filter(Boolean);
  const longest = options.reduce((max, value) => Math.max(max, value.length), 0);

  const safeLength = Math.max(6, Math.min(longest || 8, 16));

  if (gapSize === 'compact') {
    return { width: `${Math.max(9, safeLength + 2)}ch` };
  }

  if (gapSize === 'wide') {
    return { width: `${safeLength + 7}ch` };
  }

  return { width: `${safeLength + 5}ch` };
};

const splitColumns = (text: string, columns: 1 | 2) => {
  const sections = text
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

  if (columns !== 2 || sections.length <= 1) {
    return [sections];
  }

  const midpoint = Math.ceil(sections.length / 2);
  return [sections.slice(0, midpoint), sections.slice(midpoint)];
};

const splitColumnLevels = (text: string, columns: 1 | 2) => {
  const levels = text
    .split(LEVEL_BREAK_TOKEN)
    .map((level) => level.trim())
    .filter(Boolean);

  const normalizedLevels = levels.length > 0 ? levels : [text];

  return normalizedLevels.map((levelText) => {
    if (columns !== 2) {
      return splitColumns(levelText, 1);
    }

    if (levelText.includes(COLUMN_BREAK_TOKEN)) {
      const explicitColumns = levelText
        .split(COLUMN_BREAK_TOKEN)
        .map((column) =>
          column
            .split(/\n{2,}/)
            .map((section) => section.trim())
            .filter(Boolean)
        )
        .filter((columnSections) => columnSections.length > 0);

      if (explicitColumns.length > 0) {
        return explicitColumns.slice(0, 2);
      }
    }

    return splitColumns(levelText, 2);
  });
};

const renderSection = (
  section: string,
  startGapIndex: number,
  gaps: FillBlankBlock['gaps'],
  mode: FillBlankBlock['mode'],
  gapSize: FillBlankBlock['gapSize'],
  answers: string[],
  setAnswers: (answers: string[]) => void,
  gapCountRef: { current: number }
) => {
  const lines = section.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(GAP_TOKEN);

    return (
      <div key={`${startGapIndex}-${lineIndex}`} className="min-h-[2.25rem] leading-8">
        {parts.map((part, partIndex) => {
          const currentGapIndex = gapCountRef.current;
          const shouldRenderGap = partIndex < parts.length - 1;

          if (shouldRenderGap) {
            gapCountRef.current += 1;
          }

          return (
            <span key={`${startGapIndex}-${lineIndex}-${partIndex}`}>
              {part}
              {shouldRenderGap &&
                (mode === 'dropdown' && (gaps[currentGapIndex]?.suggestions || []).length > 0 ? (
                  <select
                    value={answers[currentGapIndex] || ''}
                    onChange={(event) => {
                      const nextAnswers = [...answers];
                      nextAnswers[currentGapIndex] = event.target.value;
                      setAnswers(nextAnswers);
                    }}
                    style={getGapWidthStyle(gaps, currentGapIndex, gapSize)}
                    className="mx-1 my-0.5 inline-flex max-w-full align-middle rounded-lg border border-slate-300 bg-white px-2.5 py-[0.1rem] text-center text-sm font-medium leading-5 text-slate-700 outline-none transition focus:border-slate-500"
                  >
                    <option value="">Select</option>
                    {(gaps[currentGapIndex]?.suggestions || []).map((suggestion) => (
                      <option key={suggestion} value={suggestion}>
                        {suggestion}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[currentGapIndex] || ''}
                    onChange={(event) => {
                      const nextAnswers = [...answers];
                      nextAnswers[currentGapIndex] = event.target.value;
                      setAnswers(nextAnswers);
                    }}
                    style={getGapWidthStyle(gaps, currentGapIndex, gapSize)}
                    className="mx-1 my-0.5 inline-block max-w-full align-middle rounded-lg border border-slate-300 bg-white px-2.5 py-[0.1rem] text-center text-sm font-medium leading-5 text-slate-700 outline-none transition focus:border-slate-500"
                    placeholder={gaps[currentGapIndex]?.hint || '...'}
                  />
                ))}
            </span>
          );
        })}
      </div>
    );
  });
};

export const FillBlankForm = ({ block, onUpdate }: BlockFormProps<FillBlankBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full rounded border p-2 text-sm font-semibold"
      value={block.instruction || ''}
      onChange={(e) => onUpdate({ instruction: e.target.value })}
      placeholder="Title or short instruction"
    />

    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-600">Layout</span>
      <select
        className="rounded border p-2 text-sm"
        value={block.columns || 1}
        onChange={(e) => onUpdate({ columns: Number(e.target.value) as 1 | 2 })}
      >
        <option value={1}>1 column</option>
        <option value={2}>2 columns</option>
      </select>
      <select
        className="rounded border p-2 text-sm"
        value={block.mode || 'typing'}
        onChange={(e) => onUpdate({ mode: e.target.value as FillBlankBlock['mode'] })}
      >
        <option value="typing">Typing mode</option>
        <option value="dropdown">Dropdown mode</option>
      </select>
      <select
        className="rounded border p-2 text-sm"
        value={block.gapSize || 'wide'}
        onChange={(e) => onUpdate({ gapSize: e.target.value as FillBlankBlock['gapSize'] })}
      >
        <option value="compact">Compact gaps</option>
        <option value="normal">Normal gaps</option>
        <option value="wide">Wide gaps</option>
      </select>
    </div>

    <textarea
      className="min-h-[130px] w-full rounded border p-3 text-sm leading-6"
      value={block.text}
      onChange={(e) =>
        onUpdate({
          text: e.target.value,
          gaps: syncGapsWithText(block, e.target.value)
        })
      }
      placeholder={
        'Write your text and use [] for each gap.\nUse [[column]] to split left/right and [[level]] to start a new row of columns.\n\nExample:\nShe [] to school every day.'
      }
    />

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Gaps
        </span>
        <span className="text-[10px] text-slate-400">{block.gaps.length} detected</span>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
          Each <code>[]</code> creates one gap automatically. Per-gap answer fields were removed to
          keep this editor shorter. Use <code>[[column]]</code> for side-by-side columns and{' '}
          <code>[[level]]</code> to stack another column row below.
        </div>

        <textarea
          className="min-h-[96px] w-full rounded border bg-white p-2 text-xs"
          value={getSharedSuggestionsInput(block.gaps)}
          onChange={(e) => {
            const suggestions = normalizeListInput(e.target.value);
            onUpdate({
              gaps: block.gaps.map((gap) => ({
                ...gap,
                suggestions: suggestions.length > 0 ? suggestions : undefined
              }))
            });
          }}
          placeholder="General suggestions, one per line"
        />
      </div>
    </div>
  </div>
);

export const FillBlankPreview = ({ block }: BlockPreviewProps<FillBlankBlock>) => {
  const [answers, setAnswers] = usePersistedPreviewState<string[]>(
    createPreviewStorageKey(block.id, 'fill-blank.answers'),
    block.gaps.map(() => '')
  );
  const suggestions = getUniqueSuggestions(block.gaps);
  const columns = block.columns === 2 ? 2 : 1;
  const columnLevels = useMemo(() => splitColumnLevels(block.text, columns), [block.text, columns]);
  const gapCountRef = { current: 0 };

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <p className="text-lg font-semibold text-slate-900">
          {block.instruction?.trim() || 'Complete the gaps'}
        </p>
      </div>

      <div className="space-y-5">
        {columnLevels.map((levelColumns, levelIndex) => (
          <div
            key={levelIndex}
            className={`grid items-start gap-5 ${columns === 2 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
          >
            {levelColumns.map((sections, columnIndex) => (
              <div
                key={`${levelIndex}-${columnIndex}`}
                className="self-start space-y-3 rounded-xl bg-slate-50 px-5 py-5 text-sm leading-8 text-slate-800"
              >
                {sections.map((section, sectionIndex) => (
                  <div key={`${levelIndex}-${columnIndex}-${sectionIndex}`} className="space-y-2">
                    {renderSection(
                      section,
                      gapCountRef.current,
                      block.gaps,
                      block.mode,
                      block.gapSize,
                      answers,
                      setAnswers,
                      gapCountRef
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Suggestions
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <span
                key={`${suggestion}-${index}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
