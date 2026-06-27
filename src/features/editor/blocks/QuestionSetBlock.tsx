import { Plus, Trash2 } from 'lucide-react';
import type {
  BlockFormProps,
  BlockPreviewProps,
  QuestionBuilderItem,
  QuestionSetBlock
} from '../types/index';
import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';
import { createQuestionBuilderItem } from '../domain/blockDefaults';

const QUESTION_BUILDER_MODE_OPTIONS: Array<{
  value: NonNullable<QuestionBuilderItem['mode']>;
  label: string;
}> = [
  { value: 'question-only', label: 'Only question field' },
  { value: 'answer-given', label: 'Answer is given' },
  { value: 'question-given', label: 'Question is given' },
  { value: 'free-both', label: 'Student writes both' }
];

const updateBuilderItem = (
  items: QuestionBuilderItem[],
  index: number,
  changes: Partial<QuestionBuilderItem>
) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item));

export const QuestionSetForm = ({ block, onUpdate }: BlockFormProps<QuestionSetBlock>) => {
  const practiceMode = block.practiceMode || 'mixed';
  const builderItems = block.questionBuilderItems || [createQuestionBuilderItem()];

  const addBuilderItem = () =>
    onUpdate({
      questionBuilderItems: [...builderItems, createQuestionBuilderItem()]
    });

  const removeBuilderItem = (index: number) =>
    onUpdate({
      questionBuilderItems: builderItems.filter((_, itemIndex) => itemIndex !== index)
    });

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Mixed practice title"
      />
      <textarea
        className="min-h-[72px] w-full rounded border p-2 text-sm"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction"
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Activity mode
        </label>
        <select
          className="w-full rounded border p-2 text-sm"
          value={practiceMode}
          onChange={(e) =>
            onUpdate({
              practiceMode: e.target.value === 'question-builder' ? 'question-builder' : 'mixed'
            })
          }
        >
          <option value="mixed">Mixed practice</option>
          <option value="question-builder">Question builder</option>
        </select>
      </div>

      {practiceMode === 'question-builder' ? (
        <div className="space-y-3">
          {builderItems.map((item, index) => {
            const mode = item.mode || 'answer-given';
            const showAnswerEditor = mode !== 'question-only';

            return (
              <div key={item.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBuilderItem(index)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>

                <select
                  className="w-full rounded border p-2 text-sm"
                  value={mode}
                  onChange={(e) =>
                    onUpdate({
                      questionBuilderItems: updateBuilderItem(builderItems, index, {
                        mode: e.target.value as QuestionBuilderItem['mode']
                      })
                    })
                  }
                >
                  {QUESTION_BUILDER_MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <textarea
                  className="min-h-[72px] w-full rounded border p-2 text-sm"
                  value={item.questionText || ''}
                  onChange={(e) =>
                    onUpdate({
                      questionBuilderItems: updateBuilderItem(builderItems, index, {
                        questionText: e.target.value
                      })
                    })
                  }
                />

                {showAnswerEditor && (
                  <textarea
                    className="min-h-[72px] w-full rounded border p-2 text-sm"
                    value={item.answerText || ''}
                    onChange={(e) =>
                      onUpdate({
                        questionBuilderItems: updateBuilderItem(builderItems, index, {
                          answerText: e.target.value
                        })
                      })
                    }
                  />
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addBuilderItem}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <Plus size={14} />
            Add item
          </button>
        </div>
      ) : (
        <SubQuestionsEditor questions={block.questions} onChange={(questions) => onUpdate({ questions })} />
      )}
    </div>
  );
};

export const QuestionSetPreview = ({ block }: BlockPreviewProps<QuestionSetBlock>) => {
  const practiceMode = block.practiceMode || 'mixed';
  const builderItems = block.questionBuilderItems || [];

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{block.instruction}</p>

      {practiceMode === 'question-builder' ? (
        <div className="mt-5 space-y-4">
          {builderItems.map((item, index) => {
            const mode = item.mode || 'answer-given';
            const questionLocked = mode === 'question-given';
            const answerLocked = mode === 'answer-given';
            const showAnswerField = mode !== 'question-only';

            return (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Item {index + 1}
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Write the question
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400"
                      value={questionLocked ? item.questionText || '' : undefined}
                      disabled={questionLocked}
                      readOnly={questionLocked}
                    />
                  </div>

                  {showAnswerField && (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Write the answer
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 disabled:bg-slate-100 disabled:text-slate-500"
                        value={answerLocked ? item.answerText || '' : undefined}
                        disabled={answerLocked}
                        readOnly={answerLocked}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <RenderSubQuestionsPreview questions={block.questions} storageKey={block.id} />
      )}
    </div>
  );
};
