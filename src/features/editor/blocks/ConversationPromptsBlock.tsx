import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationPromptsBlock
} from '../types/index';

export const ConversationPromptsForm = ({
  block,
  onUpdate
}: BlockFormProps<ConversationPromptsBlock>) => (
  <div className="space-y-2">
    <input
      type="text"
      className="font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Title"
    />
    <textarea
      className="min-h-24"
      value={block.prompts.join('\n')}
      onChange={(e) => onUpdate({ prompts: e.target.value.split('\n').filter(Boolean) })}
      placeholder="Prompts (One per line)"
    />
  </div>
);

export const ConversationPromptsPreview = ({
  block
}: BlockPreviewProps<ConversationPromptsBlock>) => (
  <div className="editor-note-panel my-8">
    <div className="editor-note-header">
      <span className="editor-note-icon" aria-hidden="true">
        ?
      </span>
      <div>
        <span className="editor-note-eyebrow">Discussion Time</span>
        <h3 className="editor-note-title text-lg font-semibold">{block.title}</h3>
      </div>
    </div>
    <div className="space-y-3">
      {block.prompts.map((prompt: string, index: number) => (
        <div key={index} className="editor-note-item">
          <span className="editor-note-marker">Q.</span>
          <p className="text-base leading-relaxed font-semibold text-slate-800">{prompt}</p>
        </div>
      ))}
    </div>
  </div>
);
