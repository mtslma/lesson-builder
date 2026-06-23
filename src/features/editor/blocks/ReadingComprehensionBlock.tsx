import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';
import type {
  BlockFormProps,
  BlockPreviewProps,
  ReadingComprehensionBlock
} from '../types/index';

export const ReadingComprehensionForm = ({
  block,
  onUpdate
}: BlockFormProps<ReadingComprehensionBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Passage Title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm min-h-[100px]"
      value={block.text}
      onChange={(e) => onUpdate({ text: e.target.value })}
      placeholder="Reading text..."
    />
    <SubQuestionsEditor questions={block.questions} onChange={(q) => onUpdate({ questions: q })} />
  </div>
);

export const ReadingComprehensionPreview = ({
  block
}: BlockPreviewProps<ReadingComprehensionBlock>) => (
  <div className="my-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
    <div className="bg-slate-50 p-6 border-b">
      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
        Reading Practice
      </span>
      <h3 className="text-xl font-serif font-bold mt-2">{block.title}</h3>
    </div>
    <div className="p-6">
      <p className="text-base text-slate-700 font-serif leading-loose border-l-4 border-slate-300 pl-4 mb-6 whitespace-pre-wrap">
        {block.text}
      </p>
      <RenderSubQuestionsPreview questions={block.questions} />
    </div>
  </div>
);
