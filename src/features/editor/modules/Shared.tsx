import React from 'react';
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

  return (
    <div className="border-t border-slate-200 pt-3 space-y-3">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
        Assessment Sub-Questions
      </span>
      {questions.map((q, i) => (
        <div key={q.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
          <div className="flex gap-2">
            <select
              className="p-1.5 border rounded text-xs bg-white font-bold text-slate-700"
              value={q.type}
              onChange={(e) => update(i, 'type', e.target.value as SubQuestion['type'])}
            >
              <option value="multiple-choice">A/B/C/D</option>
              <option value="true-false">True / False</option>
              <option value="open-ended">Written Response</option>
            </select>
            <input
              type="text"
              className="flex-1 p-1.5 border rounded text-xs font-sans"
              placeholder="Question..."
              value={q.question}
              onChange={(e) => update(i, 'question', e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeQ(i)}
              className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
          {q.type === 'multiple-choice' && (
            <input
              type="text"
              className="w-full p-1.5 border rounded text-[11px]"
              placeholder="Options (comma separated)"
              value={(q.options || []).join(', ')}
              onChange={(e) =>
                update(
                  i,
                  'options',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          )}
          {q.type === 'true-false' && (
            <input
              type="text"
              className="w-full p-1.5 border rounded text-[11px]"
              placeholder="Expected Answer (True or False)"
              value={q.answer || ''}
              onChange={(e) => update(i, 'answer', e.target.value)}
            />
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
}> = ({ questions, onInteraction }) => {
  if (!questions || questions.length === 0) return null;
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
            ></textarea>
          )}
          {q.type === 'true-false' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:border-lime-400 bg-white flex-1">
                <input type="radio" name={q.id} className="w-4 h-4 text-lime-600" />
                <span className="text-sm font-bold text-slate-700">True</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:border-lime-400 bg-white flex-1">
                <input type="radio" name={q.id} className="w-4 h-4 text-lime-600" />
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
                  <input type="radio" name={q.id} className="w-4 h-4 text-lime-600" />
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
