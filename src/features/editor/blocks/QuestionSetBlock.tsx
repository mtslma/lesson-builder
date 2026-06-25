import type { BlockFormProps, BlockPreviewProps, QuestionSetBlock } from '../types/index';
import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';

export const QuestionSetForm = ({ block, onUpdate }: BlockFormProps<QuestionSetBlock>) => (
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
    <SubQuestionsEditor questions={block.questions} onChange={(questions) => onUpdate({ questions })} />
  </div>
);

export const QuestionSetPreview = ({ block }: BlockPreviewProps<QuestionSetBlock>) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{block.instruction}</p>
    <RenderSubQuestionsPreview questions={block.questions} storageKey={block.id} />
  </div>
);
