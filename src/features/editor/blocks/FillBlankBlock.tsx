import { useMemo, useState } from 'react';
import type { BlockFormProps, BlockPreviewProps, FillBlankBlock } from '../types/index';

const GAP_TOKEN = '[]';

const countPlaceholders = (text: string) => (text.match(/\[\]/g) || []).length;

const syncGapsWithText = (block: FillBlankBlock, text: string): FillBlankBlock['gaps'] => {
  const placeholderCount = countPlaceholders(text);

  return Array.from({ length: placeholderCount }, (_, index) => {
    const existingGap = block.gaps[index];

    return {
      id: existingGap?.id || `gap${index + 1}`,
      acceptedAnswers: existingGap?.acceptedAnswers?.length ? existingGap.acceptedAnswers : [''],
      suggestions: existingGap?.suggestions,
      caseSensitive: existingGap?.caseSensitive ?? false
    };
  });
};

const normalizeListInput = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const getUniqueSuggestions = (gaps: FillBlankBlock['gaps']) =>
  Array.from(
    new Set(
      gaps.flatMap((gap) => (gap.suggestions || []).map((suggestion) => suggestion.trim()).filter(Boolean))
    )
  );

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

const renderSection = (
  section: string,
  startGapIndex: number,
  answers: string[],
  setAnswers: (answers: string[]) => void,
  gapCountRef: { current: number }
) => {
  const lines = section.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(GAP_TOKEN);

    return (
      <div key={`${startGapIndex}-${lineIndex}`} className="min-h-[2.25rem]">
        {parts.map((part, partIndex) => {
          const currentGapIndex = gapCountRef.current;
          const shouldRenderGap = partIndex < parts.length - 1;

          if (shouldRenderGap) {
            gapCountRef.current += 1;
          }

          return (
            <span key={`${startGapIndex}-${lineIndex}-${partIndex}`}>
              {part}
              {shouldRenderGap && (
                <input
                  type="text"
                  value={answers[currentGapIndex] || ''}
                  onChange={(event) => {
                    const nextAnswers = [...answers];
                    nextAnswers[currentGapIndex] = event.target.value;
                    setAnswers(nextAnswers);
                  }}
                  className="mx-1 inline-block min-w-[110px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-center font-medium text-slate-700 outline-none transition focus:border-slate-400"
                  placeholder="..."
                />
              )}
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
      placeholder={'Write your text and use [] for each gap.\n\nExample:\nShe [] to school every day.'}
    />

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Gaps
        </span>
        <span className="text-[10px] text-slate-400">One block below for each `[]` in the text.</span>
      </div>

      <div className="space-y-3">
        {block.gaps.map((gap, index) => (
          <div key={gap.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Gap {index + 1}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                className="min-h-[86px] rounded border p-2 text-xs"
                value={gap.acceptedAnswers.join('\n')}
                onChange={(e) => {
                  const nextGaps = [...block.gaps];
                  nextGaps[index].acceptedAnswers = normalizeListInput(e.target.value);
                  onUpdate({ gaps: nextGaps });
                }}
                placeholder="Accepted answers, one per line"
              />

              <textarea
                className="min-h-[86px] rounded border p-2 text-xs"
                value={(gap.suggestions || []).join('\n')}
                onChange={(e) => {
                  const nextGaps = [...block.gaps];
                  const suggestions = normalizeListInput(e.target.value);
                  nextGaps[index].suggestions = suggestions.length > 0 ? suggestions : undefined;
                  onUpdate({ gaps: nextGaps });
                }}
                placeholder="Optional suggestions, one per line"
              />
            </div>

            <label className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-600">
              <input
                type="checkbox"
                checked={gap.caseSensitive}
                onChange={(e) => {
                  const nextGaps = [...block.gaps];
                  nextGaps[index].caseSensitive = e.target.checked;
                  onUpdate({ gaps: nextGaps });
                }}
              />
              Case sensitive
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const FillBlankPreview = ({ block }: BlockPreviewProps<FillBlankBlock>) => {
  const [answers, setAnswers] = useState<string[]>(() => block.gaps.map(() => ''));
  const suggestions = getUniqueSuggestions(block.gaps);
  const columns = block.columns === 2 ? 2 : 1;
  const columnSections = useMemo(() => splitColumns(block.text, columns), [block.text, columns]);
  const gapCountRef = { current: 0 };

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <p className="text-lg font-semibold text-slate-900">
          {block.instruction?.trim() || 'Complete the gaps'}
        </p>
      </div>

      <div className={`grid gap-5 ${columns === 2 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {columnSections.map((sections, columnIndex) => (
          <div
            key={columnIndex}
            className="space-y-3 rounded-xl bg-slate-50 px-5 py-5 text-sm leading-8 text-slate-800"
          >
            {sections.map((section, sectionIndex) => (
              <div key={`${columnIndex}-${sectionIndex}`} className="space-y-2">
                {renderSection(section, gapCountRef.current, answers, setAnswers, gapCountRef)}
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
