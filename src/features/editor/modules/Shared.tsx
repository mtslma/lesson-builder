import React from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import type { SharedQuestionOption, SubQuestion } from '../types/index';
import {
  createQuestionGap,
  createQuestionOption,
  createSubQuestion
} from '../domain/blockDefaults';
import { moveItem, removeItemAt, updateItemAt } from '../domain/collections';

const GAP_TOKEN = '[]';

const QUESTION_TYPE_LABELS: Array<{ value: SubQuestion['type']; label: string }> = [
  { value: 'multiple-choice', label: 'Multiple choice' },
  { value: 'true-false', label: 'True / False' },
  { value: 'open-ended', label: 'Open answer' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'fill-in-the-blank', label: 'Fill in the blank' }
];

const countGapTokens = (value: string) => (value.match(/\[\]/g) || []).length;

const parseLines = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const syncQuestionGapsWithText = (question: SubQuestion, value: string) => {
  const gapCount = countGapTokens(value);
  const currentGaps = question.gaps || [];

  return Array.from({ length: gapCount }, (_, index) => {
    const existingGap = currentGaps[index];

    return existingGap || createQuestionGap();
  });
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

const getInlineGapWidthStyle = (suggestions?: string[]) => {
  const length = (suggestions || []).reduce(
    (max, suggestion) => Math.max(max, suggestion.trim().length),
    0
  );

  const safeLength = Math.max(6, Math.min(length || 8, 16));
  return { width: `${safeLength + 7}ch` };
};

const renderFillInTheBlankSection = (
  section: string,
  suggestions: string[],
  mode: 'typing' | 'dropdown',
  answers: string[],
  setAnswers: (answers: string[]) => void,
  gapCountRef: { current: number },
  questionId: string
) => {
  const lines = section.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(GAP_TOKEN);

    return (
      <div
        key={`${questionId}-${lineIndex}-${gapCountRef.current}`}
        className="min-h-[2.25rem] leading-8"
      >
        {parts.map((part, partIndex) => {
          const currentGapIndex = gapCountRef.current;
          const shouldRenderGap = partIndex < parts.length - 1;

          if (shouldRenderGap) {
            gapCountRef.current += 1;
          }

          return (
            <span key={`${questionId}-${lineIndex}-${partIndex}`}>
              {part}
              {shouldRenderGap &&
                (mode === 'dropdown' && suggestions.length > 0 ? (
                  <select
                    value={answers[currentGapIndex] || ''}
                    onChange={(event) => {
                      const nextAnswers = [...answers];
                      nextAnswers[currentGapIndex] = event.target.value;
                      setAnswers(nextAnswers);
                    }}
                    style={getInlineGapWidthStyle(suggestions)}
                    className="mx-1 my-0.5 inline-flex max-w-full align-middle rounded-lg border border-slate-300 bg-white px-2.5 py-[0.1rem] text-center text-sm font-medium leading-5 text-slate-700 outline-none transition focus:border-slate-500"
                  >
                    <option value="">Select</option>
                    {suggestions.map((suggestion) => (
                      <option key={`${questionId}-${suggestion}`} value={suggestion}>
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
                    style={getInlineGapWidthStyle(suggestions)}
                    className="mx-1 my-0.5 inline-block max-w-full align-middle rounded-lg border border-slate-300 bg-white px-2.5 py-[0.1rem] text-center text-sm font-medium leading-5 text-slate-700 outline-none transition focus:border-slate-500"
                    placeholder="..."
                  />
                ))}
            </span>
          );
        })}
      </div>
    );
  });
};

export const SubQuestionsEditor: React.FC<{
  questions: SubQuestion[];
  onChange: (q: SubQuestion[]) => void;
}> = ({ questions, onChange }) => {
  const addQ = (type?: SubQuestion['type']) => onChange([...questions, createSubQuestion(type)]);
  const removeQ = (idx: number) => onChange(removeItemAt(questions, idx));
  const moveQ = (idx: number, direction: -1 | 1) => onChange(moveItem(questions, idx, direction));
  const update = <K extends keyof SubQuestion>(idx: number, field: K, val: SubQuestion[K]) => {
    onChange(
      updateItemAt(questions, idx, (question) => ({
        ...question,
        [field]: val
      }))
    );
  };

  const updateQuestion = (idx: number, updater: (question: SubQuestion) => SubQuestion) => {
    onChange(updateItemAt(questions, idx, updater));
  };

  const addWordSuggestion = (questionIndex: number) => {
    const currentSuggestions = questions[questionIndex]?.wordSuggestions || [];
    update(questionIndex, 'wordSuggestions', [...currentSuggestions, '']);
  };

  const updateWordSuggestion = (
    questionIndex: number,
    suggestionIndex: number,
    value: string
  ) => {
    const currentSuggestions = questions[questionIndex]?.wordSuggestions || [];
    update(
      questionIndex,
      'wordSuggestions',
      updateItemAt(currentSuggestions, suggestionIndex, () => value)
    );
  };

  const removeWordSuggestion = (questionIndex: number, suggestionIndex: number) => {
    const currentSuggestions = questions[questionIndex]?.wordSuggestions || [];
    update(questionIndex, 'wordSuggestions', removeItemAt(currentSuggestions, suggestionIndex));
  };

  const changeType = (idx: number, type: SubQuestion['type']) => {
    const currentQuestion = questions[idx];
    const fallbackType: SubQuestion['type'] = QUESTION_TYPE_LABELS.some((option) => option.value === type)
      ? type
      : 'multiple-choice';
    onChange(
      updateItemAt(questions, idx, () => ({
        ...createSubQuestion(fallbackType, currentQuestion.question),
        id: currentQuestion.id,
        question: currentQuestion.question
      }))
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    changes: Partial<SharedQuestionOption>
  ) => {
    const currentOptions = questions[questionIndex]?.options || [];
    update(
      questionIndex,
      'options',
      updateItemAt(currentOptions, optionIndex, (option) => ({
        ...option,
        ...changes
      }))
    );
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = questions[questionIndex]?.options || [];
    update(questionIndex, 'options', [...currentOptions, createQuestionOption()]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const optionToRemove = question.options?.[optionIndex];
    const nextOptions = removeItemAt(question.options || [], optionIndex);
    update(questionIndex, 'options', nextOptions);

    if (optionToRemove && question.correctOptionIds?.includes(optionToRemove.id)) {
      update(
        questionIndex,
        'correctOptionIds',
        question.correctOptionIds.filter((optionId) => optionId !== optionToRemove.id)
      );
    }
  };

  const toggleCorrectOption = (questionIndex: number, optionId: string, checked: boolean) => {
    const question = questions[questionIndex];
    const currentCorrectIds = question.correctOptionIds || [];
    const nextCorrectIds =
      question.type === 'checkbox'
        ? checked
          ? [...currentCorrectIds, optionId]
          : currentCorrectIds.filter((currentId) => currentId !== optionId)
        : checked
          ? [optionId]
          : [];

    update(questionIndex, 'correctOptionIds', nextCorrectIds);
  };

  return (
    <div className="space-y-3 border-t border-slate-200 pt-3">
      <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">
        Exercises / Questions
      </span>
      {questions.map((q, i) => (
        <div key={q.id} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => moveQ(i, -1)}
                disabled={i === 0}
                className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveQ(i, 1)}
                disabled={i === questions.length - 1}
                className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
              >
                Down
              </button>
            </div>
            <select
              className="w-full rounded border bg-white p-2 text-xs font-bold text-slate-700 md:w-[220px]"
              value={QUESTION_TYPE_LABELS.some((option) => option.value === q.type) ? q.type : 'multiple-choice'}
              onChange={(e) => changeType(i, e.target.value as SubQuestion['type'])}
            >
              {!QUESTION_TYPE_LABELS.some((option) => option.value === q.type) && (
                <option value="multiple-choice">Multiple choice</option>
              )}
              {QUESTION_TYPE_LABELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="min-w-0 flex-1 rounded border p-2 text-xs"
              placeholder={
                q.type === 'fill-in-the-blank'
                  ? 'Question above the text...'
                  : 'Question or task prompt...'
              }
              value={q.question}
              onChange={(e) => update(i, 'question', e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeQ(i)}
              className="rounded border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>

          {q.type !== 'fill-in-the-blank' && (
            <textarea
              className="min-h-[62px] w-full rounded border bg-white p-2 text-xs"
              placeholder="Optional instructions / feedback / notes for this exercise"
              value={q.instructions || ''}
              onChange={(e) => update(i, 'instructions', e.target.value)}
            />
          )}

          {(q.type === 'multiple-choice' || q.type === 'checkbox') && (
            <div className="space-y-3 rounded border border-slate-200 bg-white p-3">
              {(q.options || []).map((option, optionIndex) => (
                <div
                  key={option.id}
                  className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[minmax(0,1fr)_auto_auto]"
                >
                  <input
                    type="text"
                    className="rounded border p-2 text-xs"
                    value={option.text}
                    onChange={(e) => updateOption(i, optionIndex, { text: e.target.value })}
                    placeholder="Option text"
                  />
                  <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                    <input
                      type={q.type === 'checkbox' ? 'checkbox' : 'radio'}
                      name={`correct-${q.id}`}
                      checked={(q.correctOptionIds || []).includes(option.id)}
                      onChange={(e) => toggleCorrectOption(i, option.id, e.target.checked)}
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOption(i, optionIndex)}
                    className="rounded border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(i)}
                className="text-xs font-bold text-blue-600"
              >
                + Add option
              </button>
            </div>
          )}

          {q.type === 'open-ended' && (
            <textarea
              className="min-h-[90px] w-full rounded border bg-white p-2 text-xs"
              value={(q.acceptedAnswers || []).join('\n')}
              onChange={(e) => update(i, 'acceptedAnswers', parseLines(e.target.value))}
              placeholder="Accepted answers / teacher notes, one per line"
            />
          )}

          {q.type === 'true-false' && (
            <select
              className="w-full rounded border bg-white p-2 text-xs"
              value={q.answer || 'True'}
              onChange={(e) => update(i, 'answer', e.target.value)}
            >
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}

          {q.type === 'fill-in-the-blank' && (
            <div className="space-y-2 rounded border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Layout</span>
                <select
                  className="rounded border p-2 text-sm"
                  value={q.columns || 1}
                  onChange={(e) => update(i, 'columns', Number(e.target.value) as 1 | 2)}
                >
                  <option value={1}>1 column</option>
                  <option value={2}>2 columns</option>
                </select>
                <select
                  className="rounded border p-2 text-sm"
                  value={q.mode || 'typing'}
                  onChange={(e) =>
                    update(i, 'mode', e.target.value as 'typing' | 'dropdown')
                  }
                >
                  <option value="typing">Typing mode</option>
                  <option value="dropdown">Dropdown mode</option>
                </select>
              </div>
              <textarea
                className="min-h-[80px] w-full rounded border p-2 text-xs"
                value={q.instructions || ''}
                onChange={(e) => {
                  const nextText = e.target.value;
                  updateQuestion(i, (currentQuestion) => ({
                    ...currentQuestion,
                    instructions: nextText,
                    gaps: syncQuestionGapsWithText(currentQuestion, nextText)
                  }));
                }}
                placeholder={'Write the sentence or text and use [] for each blank.\nExample: She [] to school every day.'}
              />
              <p className="text-[11px] text-slate-500">
                Use `[]` where the student should complete the text.
              </p>
              <div className="space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Suggestions
                  </span>
                  <button
                    type="button"
                    onClick={() => addWordSuggestion(i)}
                    className="text-xs font-bold text-blue-600"
                  >
                    + Add suggestion
                  </button>
                </div>
                {(q.wordSuggestions || []).length === 0 && (
                  <p className="text-xs text-slate-400">No suggestions yet.</p>
                )}
                {(q.wordSuggestions || []).map((suggestion, suggestionIndex) => (
                  <div key={`${q.id}-suggestion-${suggestionIndex}`} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded border bg-white p-2 text-xs"
                      value={suggestion}
                      onChange={(e) => updateWordSuggestion(i, suggestionIndex, e.target.value)}
                      placeholder="Suggestion"
                    />
                    <button
                      type="button"
                      onClick={() => removeWordSuggestion(i, suggestionIndex)}
                      className="rounded border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addQ()}
          className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
};

export const RenderSubQuestionsPreview: React.FC<{
  questions: SubQuestion[];
  onInteraction?: () => void;
  storageKey?: string;
}> = ({ questions, onInteraction, storageKey }) => {
  if (!questions || questions.length === 0) return null;

  const questionIds = questions.map((question) => question.id).join('|');
  const baseStorageKey = storageKey || 'shared-subquestions';
  const [answers, setAnswers] = usePersistedPreviewState<Record<string, string | string[]>>(
    createPreviewStorageKey(baseStorageKey, `subquestions.${questionIds}`),
    {}
  );

  return (
    <div className="space-y-6 border-t border-slate-100 pt-4" onChangeCapture={onInteraction} onClickCapture={onInteraction}>
      {questions.map((q, i) => (
        <div key={q.id} className="space-y-3">
          {q.type !== 'fill-in-the-blank' && (
            <label className="block text-sm font-bold text-slate-800">
              {i + 1}. {q.question}
            </label>
          )}
          {q.type !== 'fill-in-the-blank' && q.instructions?.trim() && (
            <p className="whitespace-pre-wrap text-xs text-slate-500">{q.instructions}</p>
          )}

          {q.type === 'open-ended' && (
            <textarea
              className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-lime-500 focus:bg-white"
              placeholder="Write your answer here..."
              value={String(answers[q.id] || '')}
              onChange={(event) =>
                setAnswers((currentAnswers) => ({
                  ...currentAnswers,
                  [q.id]: event.target.value
                }))
              }
            />
          )}

          {q.type === 'true-false' && (
            <div className="flex gap-4">
              {['True', 'False'].map((value) => (
                <label key={value} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border bg-white p-3">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === value}
                    onChange={() =>
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        [q.id]: value
                      }))
                    }
                  />
                  <span className="text-sm font-bold text-slate-700">{value}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'multiple-choice' && (
            <div className="space-y-2">
              {(q.options || []).map((opt, index) => (
                <label
                  key={opt.id || `${q.id}-option-${index}`}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() =>
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        [q.id]: opt.id
                      }))
                    }
                  />
                  <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'checkbox' && (
            <div className="space-y-2">
              {(q.options || []).map((opt, index) => {
                const current = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                return (
                  <label
                    key={opt.id || `${q.id}-checkbox-${index}`}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <input
                      type="checkbox"
                      checked={current.includes(opt.id)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...current, opt.id]
                          : current.filter((item) => item !== opt.id);
                        setAnswers((currentAnswers) => ({
                          ...currentAnswers,
                          [q.id]: next
                        }));
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          )}

          {q.type === 'fill-in-the-blank' && (
            <div className="space-y-2">
              {q.question?.trim() && (
                <label className="block text-sm font-bold text-slate-800">
                  {i + 1}. {q.question}
                </label>
              )}
              <div
                className={`grid gap-5 ${(q.columns || 1) === 2 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
              >
                {(() => {
                  const gapAnswers = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                  const gapCountRef = { current: 0 };
                  const sections = splitColumns(q.instructions || q.question || '', q.columns === 2 ? 2 : 1);

                  return sections.map((columnSections, columnIndex) => (
                    <div
                      key={`${q.id}-column-${columnIndex}`}
                      className="space-y-3 rounded-xl bg-slate-50 px-5 py-5 text-sm leading-8 text-slate-800"
                    >
                      {columnSections.map((section, sectionIndex) => (
                        <div key={`${q.id}-section-${columnIndex}-${sectionIndex}`} className="space-y-2">
                          {renderFillInTheBlankSection(
                            section,
                            q.wordSuggestions || [],
                            q.mode || 'typing',
                            gapAnswers,
                            (nextAnswers) =>
                              setAnswers((currentAnswers) => ({
                                ...currentAnswers,
                                [q.id]: nextAnswers
                              })),
                            gapCountRef,
                            q.id
                          )}
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
              {(q.wordSuggestions || []).length > 0 && (
                <div className="mt-1 border-t border-slate-200 pt-4">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                  {(q.wordSuggestions || []).map((suggestion, index) => (
                    <span
                      key={`${q.id}-suggestion-${suggestion}-${index}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                    >
                      {suggestion}
                    </span>
                  ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      ))}
    </div>
  );
};
