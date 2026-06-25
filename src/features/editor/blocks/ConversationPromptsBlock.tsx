import { removeItemAt, updateItemAt } from '../domain/collections';
import { createEditorId } from '../domain/ids';
import type { ReactNode } from 'react';
import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationPromptsBlock
} from '../types/index';

const createExchange = (speakerId: string, text = '') => ({
  id: createEditorId(),
  speakerId,
  text
});

const renderInlineFormatting = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(<strong key={`${match.index}-${match[0]}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

export const ConversationPromptsForm = ({
  block,
  onUpdate
}: BlockFormProps<ConversationPromptsBlock>) => {
  const speakers =
    block.speakers.length >= 2
      ? block.speakers.slice(0, 2)
      : [
          { id: createEditorId(), name: 'Speaker 1' },
          { id: createEditorId(), name: 'Speaker 2' }
        ];

  const isSingleSpeaker = (block.speakerMode || 'pair') === 'single';
  const visibleSpeakers = isSingleSpeaker ? speakers.slice(0, 1) : speakers.slice(0, 2);

  const addExchange = () => {
    onUpdate({
      speakers,
      exchanges: [...(block.exchanges || []), createExchange(visibleSpeakers[0].id)]
    });
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

      <textarea
        className="min-h-20"
        value={block.instruction || ''}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Short instruction for the speaking activity"
      />

      <select
        value={block.speakerMode || 'pair'}
        onChange={(e) =>
          onUpdate({ speakerMode: e.target.value as ConversationPromptsBlock['speakerMode'] })
        }
      >
        <option value="single">Single speaker</option>
        <option value="pair">Two speakers</option>
      </select>

      <div className={`grid gap-3 ${isSingleSpeaker ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {visibleSpeakers.map((speaker, index) => (
          <input
            key={speaker.id}
            type="text"
            value={speaker.name}
            onChange={(e) =>
              onUpdate({
                speakers: updateItemAt(speakers, index, (currentSpeaker) => ({
                  ...currentSpeaker,
                  name: e.target.value
                }))
              })
            }
            placeholder={`Speaker ${index + 1}`}
          />
        ))}
      </div>

      <div className="space-y-2">
        {(block.exchanges || []).map((exchange, index) => (
          <div key={exchange.id} className="grid gap-2 md:grid-cols-[140px_1fr_auto]">
            <select
              value={exchange.speakerId}
              onChange={(e) =>
                onUpdate({
                  exchanges: updateItemAt(block.exchanges || [], index, (currentExchange) => ({
                    ...currentExchange,
                    speakerId: e.target.value
                  }))
                })
              }
            >
              {visibleSpeakers.map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={exchange.text}
              onChange={(e) =>
                onUpdate({
                  exchanges: updateItemAt(block.exchanges || [], index, (currentExchange) => ({
                    ...currentExchange,
                    text: e.target.value
                  }))
                })
              }
              placeholder="Prompt / speaking question"
            />

            <button
              type="button"
              onClick={() => onUpdate({ exchanges: removeItemAt(block.exchanges || [], index) })}
              className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addExchange} className="text-xs font-bold text-blue-600">
        + Add prompt
      </button>
    </div>
  );
};

export const ConversationPromptsPreview = ({
  block
}: BlockPreviewProps<ConversationPromptsBlock>) => {
  const speakers = block.speakers.length >= 2 ? block.speakers.slice(0, 2) : [];
  const isSingleSpeaker = (block.speakerMode || 'pair') === 'single';
  const visibleSpeakers = isSingleSpeaker ? speakers.slice(0, 1) : speakers;
  const visibleExchanges = (block.exchanges || []).filter((exchange) => exchange.text.trim().length > 0);

  return (
    <div className="my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Speaking Challenge
        </span>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{block.title}</h3>
        {block.instruction?.trim() && (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {renderInlineFormatting(block.instruction)}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {visibleExchanges.map((exchange, index) => {
          const speaker =
            visibleSpeakers.find((item) => item.id === exchange.speakerId) ||
            visibleSpeakers[index % Math.max(visibleSpeakers.length, 1)];

          return (
            <div key={exchange.id} className="rounded-xl bg-slate-50 px-4 py-3">
              {!isSingleSpeaker && (
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {speaker?.name || 'Speaker'}
                </div>
              )}
              <p className={`whitespace-pre-wrap text-sm leading-6 text-slate-800 ${!isSingleSpeaker ? 'mt-1' : ''}`}>
                {renderInlineFormatting(exchange.text)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
