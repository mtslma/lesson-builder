import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';
import { removeItemAt, updateItemAt } from '../domain/collections';
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
    <input
      type="text"
      className="w-full rounded border p-2 text-sm"
      value={block.imageUrl || ''}
      onChange={(e) => onUpdate({ imageUrl: e.target.value })}
      placeholder="Optional image URL"
    />
    <input
      type="text"
      className="w-full rounded border p-2 text-sm"
      value={block.audioUrl || ''}
      onChange={(e) => onUpdate({ audioUrl: e.target.value })}
      placeholder="Optional audio narration URL"
    />
    <div className="space-y-2 rounded border bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Glossary
        </span>
        <button
          type="button"
          onClick={() =>
            onUpdate({
              glossaryItems: [
                ...(block.glossaryItems || []),
                { id: `${block.id}-glossary-${(block.glossaryItems || []).length + 1}`, term: '', meaning: '' }
              ]
            })
          }
          className="text-xs font-bold text-blue-600"
        >
          + Add item
        </button>
      </div>
      {(block.glossaryItems || []).map((item, index) => (
        <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
          <input
            className="rounded border p-2 text-xs"
            value={item.term}
            onChange={(e) =>
              onUpdate({
                glossaryItems: updateItemAt(block.glossaryItems || [], index, (currentItem) => ({
                  ...currentItem,
                  term: e.target.value
                }))
              })
            }
            placeholder="Term"
          />
          <input
            className="rounded border p-2 text-xs"
            value={item.meaning}
            onChange={(e) =>
              onUpdate({
                glossaryItems: updateItemAt(block.glossaryItems || [], index, (currentItem) => ({
                  ...currentItem,
                  meaning: e.target.value
                }))
              })
            }
            placeholder="Meaning"
          />
          <button
            type="button"
            onClick={() =>
              onUpdate({ glossaryItems: removeItemAt(block.glossaryItems || [], index) })
            }
            className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
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
      {block.imageUrl && (
        <img src={block.imageUrl} alt="" className="mb-5 h-48 w-full rounded-2xl object-cover" />
      )}
      <p className="text-base text-slate-700 font-serif leading-loose border-l-4 border-slate-300 pl-4 mb-6 whitespace-pre-wrap">
        {block.text}
      </p>
      {(block.glossaryItems || []).length > 0 && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Glossary
          </div>
          <div className="mt-2 grid gap-2">
            {(block.glossaryItems || []).map((item) => (
              <div key={item.id} className="text-sm text-slate-700">
                <strong>{item.term}:</strong> {item.meaning}
              </div>
            ))}
          </div>
        </div>
      )}
      <RenderSubQuestionsPreview questions={block.questions} storageKey={block.id} />
      {(block.discussionQuestions || []).length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Discussion
          </div>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {(block.discussionQuestions || []).map((question, index) => (
              <li key={`${block.id}-discussion-${index}`}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);
