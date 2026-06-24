import type { BlockFormProps, BlockPreviewProps, GrammarNoteBlock } from '../types/index';

const renderParagraphs = (content: string, className: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className={className}>
        {paragraph}
      </p>
    ));

export const GrammarNoteForm = ({ block, onUpdate }: BlockFormProps<GrammarNoteBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full rounded border p-2 text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Note Title"
    />
    <textarea
      className="min-h-[140px] w-full rounded border p-2 text-sm"
      value={block.ruleContext}
      onChange={(e) => onUpdate({ ruleContext: e.target.value })}
      placeholder="Main explanation. Use a blank line to start a new paragraph."
    />
    <input
      type="text"
      className="w-full rounded border p-2 text-sm"
      value={block.expandableTitle}
      onChange={(e) => onUpdate({ expandableTitle: e.target.value })}
      placeholder="Examples title"
    />
    <textarea
      className="min-h-[120px] w-full rounded border p-2 text-sm"
      value={block.expandableContent}
      onChange={(e) => onUpdate({ expandableContent: e.target.value })}
      placeholder="Examples. Use a blank line to separate blocks."
    />
  </div>
);

export const GrammarNotePreview = ({ block }: BlockPreviewProps<GrammarNoteBlock>) => (
  <div className="my-6 overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm">
    <div className="border-b border-blue-100 px-5 py-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">{block.title}</h3>
    </div>

    <div className="space-y-4 px-5 py-5">
      <div className="space-y-3">
        {renderParagraphs(block.ruleContext, 'text-sm leading-6 text-slate-700')}
      </div>

      {block.expandableContent.trim().length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-white px-4 py-4">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">
            {block.expandableTitle || 'Examples'}
          </div>
          <div className="space-y-3">
            {renderParagraphs(block.expandableContent, 'text-sm leading-6 text-slate-700')}
          </div>
        </div>
      )}
    </div>
  </div>
);
