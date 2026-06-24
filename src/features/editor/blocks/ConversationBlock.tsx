import type { ReactNode } from 'react';
import type { BlockFormProps, BlockPreviewProps, ConversationBlock } from '../types/index';
import {
  createConversationHighlight,
  createConversationMessage,
  getConversationHighlightMatches
} from '../domain/conversation';
import { moveItem, removeItemAt, updateItemAt } from '../domain/collections';

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Green', value: '#d9f99d' },
  { label: 'Purple', value: '#d6b2eea2' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Amber', value: '#fde68a' },
  { label: 'Rose', value: '#fecdd3' }
] as const;

type ConversationMessage = ConversationBlock['messages'][number];
type ConversationHighlight = ConversationMessage['highlights'][number];

export const ConversationForm = ({ block, onUpdate }: BlockFormProps<ConversationBlock>) => {
  const updateMessages = (messages: ConversationBlock['messages']) => {
    onUpdate({ messages });
  };

  const addMessage = () => {
    updateMessages([...block.messages, createConversationMessage()]);
  };

  const removeMessage = (index: number) => {
    updateMessages(removeItemAt(block.messages, index));
  };

  const updateMessage = <K extends keyof ConversationMessage>(
    index: number,
    field: K,
    value: ConversationMessage[K]
  ) => {
    updateMessages(
      updateItemAt(block.messages, index, (message) => ({
        ...message,
        [field]: value
      }))
    );
  };

  const moveMessage = (index: number, direction: -1 | 1) => {
    updateMessages(moveItem(block.messages, index, direction));
  };

  const addHighlight = (messageIndex: number) => {
    const message = block.messages[messageIndex];
    updateMessage(messageIndex, 'highlights', [...message.highlights, createConversationHighlight()]);
  };

  const updateHighlight = <K extends keyof ConversationHighlight>(
    messageIndex: number,
    highlightIndex: number,
    field: K,
    value: ConversationHighlight[K]
  ) => {
    const message = block.messages[messageIndex];
    updateMessage(
      messageIndex,
      'highlights',
      updateItemAt(message.highlights, highlightIndex, (highlight) => ({
        ...highlight,
        [field]: value
      }))
    );
  };

  const removeHighlight = (messageIndex: number, highlightIndex: number) => {
    const message = block.messages[messageIndex];

    updateMessage(messageIndex, 'highlights', removeItemAt(message.highlights, highlightIndex));
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.imageUrl ?? ''}
        onChange={(event) =>
          onUpdate({
            imageUrl: event.target.value
          })
        }
        placeholder="Context Image URL"
      />

      <div className="space-y-3">
        {block.messages.map((message, messageIndex) => (
          <div
            key={message.id}
            className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => moveMessage(messageIndex, -1)}
                  disabled={messageIndex === 0}
                  className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move line up"
                  title="Move line up"
                >
                  Up
                </button>

                <button
                  type="button"
                  onClick={() => moveMessage(messageIndex, 1)}
                  disabled={messageIndex === block.messages.length - 1}
                  className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move line down"
                  title="Move line down"
                >
                  Down
                </button>
              </div>

              <input
                type="text"
                className="w-1/4 rounded border p-2 text-xs font-bold"
                value={message.speaker}
                onChange={(event) => updateMessage(messageIndex, 'speaker', event.target.value)}
                placeholder="Speaker"
              />

              <input
                type="text"
                className="flex-1 rounded border p-2 text-xs"
                value={message.text}
                onChange={(event) => updateMessage(messageIndex, 'text', event.target.value)}
                placeholder="Dialogue"
              />

              <button
                type="button"
                onClick={() => removeMessage(messageIndex)}
                className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>

            <div className="space-y-2 rounded-md border border-dashed border-slate-300 bg-white p-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Highlights
                </span>

                <button
                  type="button"
                  onClick={() => addHighlight(messageIndex)}
                  className="text-xs font-bold text-blue-600"
                >
                  + Add highlight
                </button>
              </div>

              {message.highlights.length === 0 && (
                <p className="text-xs text-slate-400">No highlighted sections.</p>
              )}

              {message.highlights.map((highlight, highlightIndex) => (
                <div key={highlight.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded border p-1.5 text-xs"
                    value={highlight.text}
                    onChange={(event) =>
                      updateHighlight(messageIndex, highlightIndex, 'text', event.target.value)
                    }
                    placeholder="Exact text to highlight"
                  />

                  <select
                    className="w-28 rounded border p-1.5 text-xs"
                    value={highlight.color}
                    onChange={(event) =>
                      updateHighlight(messageIndex, highlightIndex, 'color', event.target.value)
                    }
                  >
                    {HIGHLIGHT_COLOR_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <span
                    className="h-7 w-7 shrink-0 rounded border"
                    style={{
                      backgroundColor: highlight.color,
                      borderColor: highlight.color
                    }}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => removeHighlight(messageIndex, highlightIndex)}
                    className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addMessage} className="text-xs font-bold text-blue-600">
        + Add Line
      </button>
    </div>
  );
};

const renderHighlightedDialogue = (message: ConversationMessage) => {
  const matches = getConversationHighlightMatches(message);

  if (matches.length === 0) {
    return message.text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      parts.push(<span key={`text-${cursor}`}>{message.text.slice(cursor, match.start)}</span>);
    }

    parts.push(
      <span
        key={match.id}
        className="rounded border-b px-1 py-0.5 font-bold"
        style={{
          backgroundColor: match.color,
          borderColor: match.color
        }}
      >
        {message.text.slice(match.start, match.end)}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < message.text.length) {
    parts.push(<span key={`text-${cursor}`}>{message.text.slice(cursor)}</span>);
  }

  return parts;
};

export const ConversationPreview = ({ block }: BlockPreviewProps<ConversationBlock>) => (
  <div className="my-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
    {block.imageUrl && (
      <img
        src={block.imageUrl}
        className="h-32 w-full rounded-lg border border-slate-200 object-cover"
        alt="Conversation context"
      />
    )}

    {block.messages.map((message) => (
      <div key={message.id} className="flex gap-4 font-sans text-sm">
        <span className="min-w-[60px] text-xs font-extrabold uppercase tracking-wide text-slate-900">
          {message.speaker}:
        </span>

        <p className="text-slate-800">{renderHighlightedDialogue(message)}</p>
      </div>
    ))}
  </div>
);
