import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  createConversationHighlight,
  getConversationHighlightMatches
} from '../domain/conversation';
import { removeItemAt, updateItemAt } from '../domain/collections';
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

export const ListeningForm = ({ block, onUpdate }: BlockFormProps<ListeningBlock>) => {
  const transcriptHighlights = block.transcriptHighlights ?? [];

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
        className="min-h-[110px] w-full rounded border p-2 text-sm"
        value={block.transcript || ''}
        onChange={(e) => onUpdate({ transcript: e.target.value })}
        placeholder="Optional transcript"
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const transcriptVisibility = block.transcriptVisibility || 'hidden';
  const showTranscript =
    transcriptVisibility === 'always' ||
    (transcriptVisibility === 'after-answer' && hasInteracted);

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
        onInteraction={() => setHasInteracted(true)}
      />

      {showTranscript && block.transcript && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Transcript
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {renderHighlightedTranscript(block.transcript, block.transcriptHighlights)}
          </p>
        </div>
      )}
    </div>
  );
};
