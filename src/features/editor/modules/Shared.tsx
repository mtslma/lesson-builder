import React from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import type { SubQuestion } from '../types/index';
import { createSubQuestion } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';

export const SubQuestionsEditor: React.FC<{
  questions: SubQuestion[];
  onChange: (q: SubQuestion[]) => void;
}> = ({ questions, onChange }) => {
  const addQ = () => onChange([...questions, createSubQuestion()]);
  const removeQ = (idx: number) => onChange(removeItemAt(questions, idx));
  const update = <K extends keyof SubQuestion>(idx: number, field: K, val: SubQuestion[K]) => {
    onChange(
      updateItemAt(questions, idx, (question) => ({
        ...question,
        [field]: val
      }))
    );
  };
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const nextOptions = [...(questions[questionIndex]?.options || [])];
    nextOptions[optionIndex] = value;
    update(questionIndex, 'options', nextOptions);
  };
  const addOption = (questionIndex: number) => {
    update(questionIndex, 'options', [...(questions[questionIndex]?.options || []), '']);
  };
  const removeOption = (questionIndex: number, optionIndex: number) => {
    update(
      questionIndex,
      'options',
      (questions[questionIndex]?.options || []).filter((_, currentIndex) => currentIndex !== optionIndex)
    );
  };

  return (
    <div className="border-t border-slate-200 pt-3 space-y-3">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
        Assessment Sub-Questions
      </span>
      {questions.map((q, i) => (
        <div key={q.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-start">
            <select
              className="w-full rounded border bg-white p-2 text-xs font-bold text-slate-700 md:w-[150px] md:shrink-0"
              value={q.type}
              onChange={(e) => update(i, 'type', e.target.value as SubQuestion['type'])}
            >
              <option value="multiple-choice">A/B/C/D</option>
              <option value="true-false">True / False</option>
              <option value="open-ended">Written Response</option>
            </select>
            <input
              type="text"
              className="min-w-0 flex-1 rounded border p-2 text-xs font-sans"
              placeholder="Question..."
              value={q.question}
              onChange={(e) => update(i, 'question', e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeQ(i)}
              className="rounded border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 md:shrink-0"
            >
              Remove
            </button>
          </div>
          {q.type === 'multiple-choice' && (
            <div className="space-y-2 rounded-md border border-slate-200 bg-white p-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Options
                </span>
                <button
                  type="button"
                  onClick={() => addOption(i)}
                  className="rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600"
                >
                  + Add option
                </button>
              </div>

              {(q.options || []).map((option, optionIndex) => (
                <div key={`${q.id}-option-${optionIndex}`} className="flex items-center gap-2">
                  <span className="w-6 text-center text-[10px] font-bold uppercase text-slate-400">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <input
                    type="text"
                    className="flex-1 rounded border p-1.5 text-[11px]"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(i, optionIndex, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i, optionIndex)}
                    className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {(q.options || []).length === 0 && (
                <p className="text-[11px] text-slate-400">Add each answer as a separate option.</p>
              )}
            </div>
          )}
          {q.type === 'true-false' && (
            <div className="rounded-md border border-slate-200 bg-white p-2">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Correct Answer
              </span>
              <div className="flex gap-2">
                <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name={`${q.id}-expected-answer`}
                    checked={q.answer === 'True'}
                    onChange={() => update(i, 'answer', 'True')}
                  />
                  True
                </label>
                <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name={`${q.id}-expected-answer`}
                    checked={q.answer === 'False'}
                    onChange={() => update(i, 'answer', 'False')}
                  />
                  False
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addQ}
        className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded"
      >
        + Add Question
      </button>
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
  const [answers, setAnswers] = usePersistedPreviewState<Record<string, string>>(
    createPreviewStorageKey(baseStorageKey, `subquestions.${questionIds}`),
    {}
  );

  return (
    <div
      className="space-y-6 pt-4 border-t border-slate-100"
      onChangeCapture={onInteraction}
      onClickCapture={onInteraction}
    >
      {questions.map((q, i) => (
        <div key={q.id} className="space-y-3">
          <label className="text-sm font-bold text-slate-800 block font-sans">
            {i + 1}. {q.question}
          </label>
          {q.type === 'open-ended' && (
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-lime-500 transition-colors h-24 resize-none"
              placeholder="Write your answer here..."
              value={answers[q.id] || ''}
              onChange={(event) =>
                setAnswers((currentAnswers) => ({
                  ...currentAnswers,
                  [q.id]: event.target.value
                }))
              }
            ></textarea>
          )}
          {q.type === 'true-false' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:border-lime-400 bg-white flex-1">
                <input
                  type="radio"
                  name={q.id}
                  className="w-4 h-4 text-lime-600"
                  checked={answers[q.id] === 'True'}
                  onChange={() =>
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      [q.id]: 'True'
                    }))
                  }
                />
                <span className="text-sm font-bold text-slate-700">True</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:border-lime-400 bg-white flex-1">
                <input
                  type="radio"
                  name={q.id}
                  className="w-4 h-4 text-lime-600"
                  checked={answers[q.id] === 'False'}
                  onChange={() =>
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      [q.id]: 'False'
                    }))
                  }
                />
                <span className="text-sm font-bold text-slate-700">False</span>
              </label>
            </div>
          )}
          {q.type === 'multiple-choice' && (
            <div className="space-y-2">
              {q.options?.map((opt, oIdx) => (
                <label
                  key={oIdx}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-lime-400 transition-colors"
                >
                  <input
                    type="radio"
                    name={q.id}
                    className="w-4 h-4 text-lime-600"
                    checked={answers[q.id] === opt}
                    onChange={() =>
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        [q.id]: opt
                      }))
                    }
                  />
                  <span className="text-sm font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
