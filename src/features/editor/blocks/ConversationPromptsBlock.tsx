import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationPromptsBlock
} from '../types/index';

const updatePromptAtIndex = (prompts: string[], index: number, value: string) =>
  prompts.map((prompt, promptIndex) => (promptIndex === index ? value : prompt));

export const ConversationPromptsForm = ({
  block,
  onUpdate
}: BlockFormProps<ConversationPromptsBlock>) => {
  const prompts = block.prompts.length ? block.prompts : [''];

  const addPrompt = () => onUpdate({ prompts: [...prompts, ''] });

  const removePrompt = (index: number) => {
    const nextPrompts = prompts.filter((_, promptIndex) => promptIndex !== index);
    onUpdate({ prompts: nextPrompts.length ? nextPrompts : [''] });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title"
      />

      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Question {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removePrompt(index)}
                className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>
            <textarea
              className="min-h-20"
              value={prompt}
              onChange={(e) =>
                onUpdate({
                  prompts: updatePromptAtIndex(prompts, index, e.target.value)
                })
              }
              placeholder="Write one talking question here"
            />
          </div>
        ))}
      </div>

      <button type="button" onClick={addPrompt} className="text-xs font-bold text-blue-600">
        + Add Question
      </button>
    </div>
  );
};

export const ConversationPromptsPreview = ({
  block
}: BlockPreviewProps<ConversationPromptsBlock>) => (
  <div className="editor-note-panel my-8">
    <div className="editor-note-header">
      <span className="editor-note-icon" aria-hidden="true">
        ?
      </span>
      <div>
        <span className="editor-note-eyebrow">Talking</span>
        <h3 className="editor-note-title text-lg font-semibold">{block.title}</h3>
      </div>
    </div>
    <div className="space-y-3">
      {block.prompts.filter(Boolean).map((prompt: string, index: number) => (
        <div key={index} className="editor-note-item">
          <span className="editor-note-marker">Q.</span>
          <p className="text-base leading-relaxed font-semibold text-slate-800">{prompt}</p>
        </div>
      ))}
    </div>
  </div>
);
