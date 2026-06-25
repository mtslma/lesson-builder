import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  createConversationMessage,
  createConversationHighlight,
  getConversationHighlightMatches
} from '../domain/conversation';
import { moveItem, removeItemAt, updateItemAt } from '../domain/collections';
import { createPreviewStorageKey } from '../domain/previewState';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';
import type {
  BlockFormProps,
  BlockPreviewProps,
  ConversationMessage,
  ListeningBlock
} from '../types/index';

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Green', value: '#d9f99d' },
  { label: 'Purple', value: '#d6b2eea2' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Amber', value: '#fde68a' },
  { label: 'Rose', value: '#fecdd3' }
] as const;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const renderHighlightedTranscript = (text: string, highlights: ListeningBlock['transcriptHighlights']) => {
  const transcriptMessage: ConversationMessage = {
    id: 'listening-transcript',
    speaker: '',
    text,
    highlights: highlights ?? []
  };
  const matches = getConversationHighlightMatches(transcriptMessage);

  if (matches.length === 0) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      parts.push(<span key={`text-${cursor}`}>{text.slice(cursor, match.start)}</span>);
    }

    parts.push(
      <span
        key={match.id}
        className="rounded border-b px-1 py-0.5 font-semibold"
        style={{
          backgroundColor: match.color,
          borderColor: match.color
        }}
      >
        {text.slice(match.start, match.end)}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(<span key={`text-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return parts;
};

type ScriptMessage = NonNullable<ListeningBlock['script']>[number];
type ScriptHighlight = ScriptMessage['highlights'][number];

const renderHighlightedScriptMessage = (message: ScriptMessage) => {
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
        className="rounded border-b px-1 py-0.5 font-semibold"
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

export const ListeningForm = ({ block, onUpdate }: BlockFormProps<ListeningBlock>) => {
  const script = block.script ?? [];
  const transcriptHighlights = block.transcriptHighlights ?? [];

  const updateScript = (nextScript: ScriptMessage[]) => {
    onUpdate({ script: nextScript });
  };

  const addScriptMessage = () => {
    updateScript([...script, createConversationMessage()]);
  };

  const removeScriptMessage = (index: number) => {
    updateScript(removeItemAt(script, index));
  };

  const updateScriptMessage = <K extends keyof ScriptMessage>(
    index: number,
    field: K,
    value: ScriptMessage[K]
  ) => {
    updateScript(
      updateItemAt(script, index, (message) => ({
        ...message,
        [field]: value
      }))
    );
  };

  const moveScriptMessage = (index: number, direction: -1 | 1) => {
    updateScript(moveItem(script, index, direction));
  };

  const addScriptHighlight = (messageIndex: number) => {
    const message = script[messageIndex];
    updateScriptMessage(messageIndex, 'highlights', [
      ...message.highlights,
      createConversationHighlight()
    ]);
  };

  const updateScriptHighlight = <K extends keyof ScriptHighlight>(
    messageIndex: number,
    highlightIndex: number,
    field: K,
    value: ScriptHighlight[K]
  ) => {
    const message = script[messageIndex];
    updateScriptMessage(
      messageIndex,
      'highlights',
      updateItemAt(message.highlights, highlightIndex, (highlight) => ({
        ...highlight,
        [field]: value
      }))
    );
  };

  const removeScriptHighlight = (messageIndex: number, highlightIndex: number) => {
    const message = script[messageIndex];
    updateScriptMessage(
      messageIndex,
      'highlights',
      removeItemAt(message.highlights, highlightIndex)
    );
  };

  const updateTranscriptHighlights = (highlights: NonNullable<ListeningBlock['transcriptHighlights']>) => {
    onUpdate({ transcriptHighlights: highlights });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Exercise title"
      />
      <textarea
        className="min-h-[84px] w-full rounded border p-2 text-sm"
        value={block.instruction || ''}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction or detailed prompt for the student"
      />
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.audioUrl}
        onChange={(e) => onUpdate({ audioUrl: e.target.value })}
        placeholder="Audio URL or /audios/example.mp3"
      />
      <input
        type="text"
        className="w-full rounded border p-2 text-sm"
        value={block.contextImageUrl || ''}
        onChange={(e) => onUpdate({ contextImageUrl: e.target.value })}
        placeholder="Context image URL"
      />

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Listening Script
          </span>
          <span className="text-[10px] text-slate-400">Add speakers, lines and highlights.</span>
        </div>

        <div className="space-y-3">
          {script.map((message, messageIndex) => (
            <div
              key={message.id}
              className="space-y-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => moveScriptMessage(messageIndex, -1)}
                    disabled={messageIndex === 0}
                    className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveScriptMessage(messageIndex, 1)}
                    disabled={messageIndex === script.length - 1}
                    className="rounded border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Down
                  </button>
                </div>

                <input
                  type="text"
                  className="w-1/4 rounded border p-2 text-xs font-bold"
                  value={message.speaker}
                  onChange={(event) =>
                    updateScriptMessage(messageIndex, 'speaker', event.target.value)
                  }
                  placeholder="Speaker"
                />

                <input
                  type="text"
                  className="flex-1 rounded border p-2 text-xs"
                  value={message.text}
                  onChange={(event) => updateScriptMessage(messageIndex, 'text', event.target.value)}
                  placeholder="Dialogue"
                />

                <button
                  type="button"
                  onClick={() => removeScriptMessage(messageIndex)}
                  className="rounded border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Highlights
                  </span>

                  <button
                    type="button"
                    onClick={() => addScriptHighlight(messageIndex)}
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
                        updateScriptHighlight(
                          messageIndex,
                          highlightIndex,
                          'text',
                          event.target.value
                        )
                      }
                      placeholder="Exact text to highlight"
                    />

                    <select
                      className="w-28 rounded border p-1.5 text-xs"
                      value={highlight.color}
                      onChange={(event) =>
                        updateScriptHighlight(
                          messageIndex,
                          highlightIndex,
                          'color',
                          event.target.value
                        )
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
                      onClick={() => removeScriptHighlight(messageIndex, highlightIndex)}
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

        <button type="button" onClick={addScriptMessage} className="text-xs font-bold text-blue-600">
          + Add Line
        </button>
      </div>

      <select
        className="w-full rounded border p-2 text-sm"
        value={block.transcriptVisibility || 'hidden'}
        onChange={(e) =>
          onUpdate({ transcriptVisibility: e.target.value as ListeningBlock['transcriptVisibility'] })
        }
      >
        <option value="hidden">Transcript Hidden</option>
        <option value="after-answer">Show Transcript After Answering</option>
        <option value="always">Transcript Always Visible</option>
      </select>
      <textarea
        className="min-h-[90px] w-full rounded border p-2 text-sm"
        value={block.transcript || ''}
        onChange={(e) => onUpdate({ transcript: e.target.value })}
        placeholder="Optional plain transcript fallback/import field"
      />

      <div className="space-y-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Transcript highlights
          </span>

          <button
            type="button"
            onClick={() =>
              updateTranscriptHighlights([...transcriptHighlights, createConversationHighlight()])
            }
            className="text-xs font-bold text-blue-600"
          >
            + Add highlight
          </button>
        </div>

        {transcriptHighlights.length === 0 && (
          <p className="text-xs text-slate-400">No highlighted sections.</p>
        )}

        {transcriptHighlights.map((highlight, highlightIndex) => (
          <div key={highlight.id} className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded border p-1.5 text-xs"
              value={highlight.text}
              onChange={(event) =>
                updateTranscriptHighlights(
                  updateItemAt(transcriptHighlights, highlightIndex, (currentHighlight) => ({
                    ...currentHighlight,
                    text: event.target.value
                  }))
                )
              }
              placeholder="Exact text to highlight"
            />

            <select
              className="w-28 rounded border p-1.5 text-xs"
              value={highlight.color}
              onChange={(event) =>
                updateTranscriptHighlights(
                  updateItemAt(transcriptHighlights, highlightIndex, (currentHighlight) => ({
                    ...currentHighlight,
                    color: event.target.value
                  }))
                )
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
              onClick={() =>
                updateTranscriptHighlights(removeItemAt(transcriptHighlights, highlightIndex))
              }
              className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <SubQuestionsEditor
        questions={block.questions || []}
        onChange={(questions) => onUpdate({ questions })}
      />
    </div>
  );
};

export const ListeningPreview = ({ block }: BlockPreviewProps<ListeningBlock>) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = usePersistedPreviewState<boolean>(
    createPreviewStorageKey(block.id, 'listening.interacted'),
    false
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const transcriptVisibility = block.transcriptVisibility || 'hidden';
  const showTranscript =
    transcriptVisibility === 'always' ||
    (transcriptVisibility === 'after-answer' && hasInteracted);
  const script = block.script ?? [];

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [block.audioUrl]);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const jumpPlayback = (offset: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.min(Math.max(audio.currentTime + offset, 0), duration || audio.duration || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="my-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-4">
          {block.contextImageUrl ? (
            <img
              src={block.contextImageUrl}
              className="h-20 w-20 shrink-0 rounded-2xl border border-white object-cover shadow-sm"
              alt="Context"
            />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-[linear-gradient(135deg,#e2e8f0_0%,#f8fafc_100%)]" />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Listen and answer
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {block.title?.trim() || 'Listening exercise'}
            </p>
            {block.instruction?.trim() && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {block.instruction}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => jumpPlayback(-5)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                -5s
              </button>

              <button
                type="button"
                onClick={() => {
                  void togglePlayback();
                }}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                type="button"
                onClick={() => jumpPlayback(5)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                +5s
              </button>

              <div className="ml-auto text-[11px] font-medium text-slate-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => {
              const audio = audioRef.current;
              const nextTime = Number(event.target.value);

              setCurrentTime(nextTime);

              if (audio) {
                audio.currentTime = nextTime;
              }
            }}
            className="audio-slider w-full"
          />
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>0:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={block.audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <RenderSubQuestionsPreview
        questions={block.questions}
        storageKey={block.id}
        onInteraction={() => setHasInteracted(true)}
      />

      {showTranscript && (script.length > 0 || block.transcript) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Transcript
          </div>
          {script.length > 0 ? (
            <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              {script.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <span className="min-w-[72px] text-xs font-extrabold uppercase tracking-wide text-slate-900">
                    {message.speaker || 'Audio'}:
                  </span>
                  <p>{renderHighlightedScriptMessage(message)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {renderHighlightedTranscript(block.transcript || '', block.transcriptHighlights)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
