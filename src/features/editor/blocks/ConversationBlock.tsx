import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationBlock
} from '../types/index';

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Default', value: '#d9f99d' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Amber', value: '#fde68a' },
  { label: 'Rose', value: '#fecdd3' }
] as const;

type ConversationMessage = ConversationBlock['messages'][number];

export const ConversationForm = ({ block, onUpdate }: BlockFormProps<ConversationBlock>) => {
  const addMsg = () =>
    onUpdate({
      messages: [
        ...block.messages,
        {
          id: crypto.randomUUID(),
          speaker: '',
          text: '',
          highlighted: false,
          highlightColor: '#d9f99d'
        }
      ]
    });

  const removeMsg = (index: number) =>
    onUpdate({ messages: block.messages.filter((_, messageIndex) => messageIndex !== index) });

  const updateMessage = <K extends keyof ConversationMessage>(
    index: number,
    field: K,
    value: ConversationMessage[K]
  ) => {
    const nextMessages = [...block.messages];
    nextMessages[index] = { ...nextMessages[index], [field]: value };
    onUpdate({ messages: nextMessages });
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="mb-2 w-full rounded border p-2 text-sm"
        value={block.imageUrl || ''}
        onChange={(e) => onUpdate({ imageUrl: e.target.value })}
        placeholder="Context Image URL"
      />
      {block.messages.map((message, index) => (
        <div key={message.id} className="flex items-center gap-2 rounded border bg-slate-50 p-1">
          <input
            type="text"
            className="w-1/4 rounded border p-1.5 text-xs font-bold"
            value={message.speaker}
            onChange={(e) => updateMessage(index, 'speaker', e.target.value)}
            placeholder="Speaker"
          />
          <input
            type="text"
            className="flex-1 rounded border p-1.5 text-xs"
            value={message.text}
            onChange={(e) => updateMessage(index, 'text', e.target.value)}
            placeholder="Dialogue"
          />
          <label className="flex items-center gap-1 text-[10px] text-slate-500">
            <input
              type="checkbox"
              checked={Boolean(message.highlighted)}
              onChange={(e) => updateMessage(index, 'highlighted', e.target.checked)}
            />
            Highlight
          </label>
          <select
            className="w-24 rounded border p-1.5 text-xs"
            value={message.highlightColor || '#d9f99d'}
            onChange={(e) => updateMessage(index, 'highlightColor', e.target.value)}
          >
            {HIGHLIGHT_COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500">Use `[text]`</span>
          <button
            type="button"
            onClick={() => removeMsg(index)}
            className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addMsg} className="text-xs font-bold text-blue-600">
        + Add Line
      </button>
    </div>
  );
};

const renderHighlightedDialogue = (message: {
  text: string;
  highlighted?: boolean;
  highlightColor?: string;
}) => {
  const color = message.highlightColor || '#d9f99d';
  if (!message.highlighted) return message.text;

  const bracketMatch = message.text.match(/\[([^\]]+)\]/);
  if (!bracketMatch) return message.text;

  const fullMatch = bracketMatch[0];
  const highlightedContent = bracketMatch[1];
  const [before, after] = message.text.split(fullMatch);

  return (
    <>
      {before}
      <span
        className="rounded border-b px-1 py-0.5 font-bold"
        style={{ backgroundColor: color, borderColor: color }}
      >
        {highlightedContent}
      </span>
      {after}
    </>
  );
};

export const ConversationPreview = ({ block }: BlockPreviewProps<ConversationBlock>) => (
  <div className="my-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
    {block.imageUrl && (
      <img
        src={block.imageUrl}
        className="h-32 w-full rounded-lg border border-slate-200 object-cover"
        alt="Context"
      />
    )}
    {block.messages.map((message) => (
      <div key={message.id} className="flex gap-4 text-sm font-sans">
        <span className="min-w-[60px] text-xs font-extrabold uppercase tracking-wide text-slate-900">
          {message.speaker}:
        </span>
        <p className="text-slate-800">{renderHighlightedDialogue(message)}</p>
      </div>
    ))}
    {block.substitutionBox && block.substitutionBox.length > 0 && (
      <div className="mt-4 space-y-2 border-t border-dashed border-slate-300 pt-4">
        <span className="text-[10px] font-bold uppercase text-slate-500">Alternatives</span>
        {block.substitutionBox.map((substitution, index) => (
          <div
            key={`${substitution.original}-${index}`}
            className="rounded-lg border bg-white p-2.5 text-xs font-medium text-slate-600"
          >
            <strong className="text-slate-900">{substitution.original}</strong> {'->'}{' '}
            {substitution.alternatives.join(' / ')}
          </div>
        ))}
      </div>
    )}
  </div>
);
