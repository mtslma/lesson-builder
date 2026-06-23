import { useState } from 'react';
import { SubQuestionsEditor, RenderSubQuestionsPreview } from '../modules/Shared';
import type { BlockFormProps, BlockPreviewProps, ListeningBlock } from '../types/index';

export const ListeningForm = ({ block, onUpdate }: BlockFormProps<ListeningBlock>) => (
  <div className="space-y-3">
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded text-sm"
        value={block.audioUrl}
        onChange={(e) => onUpdate({ audioUrl: e.target.value })}
        placeholder="Audio URL"
      />
      <input
        type="number"
        className="w-24 p-2 border rounded text-sm"
        value={block.maxPlays || ''}
        onChange={(e) => onUpdate({ maxPlays: Number(e.target.value) })}
        placeholder="Plays"
      />
    </div>
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.contextImageUrl || ''}
      onChange={(e) => onUpdate({ contextImageUrl: e.target.value })}
      placeholder="Context Image URL"
    />
    <select
      className="w-full p-2 border rounded text-sm"
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
      className="w-full p-2 border rounded text-sm min-h-[90px]"
      value={block.transcript || ''}
      onChange={(e) => onUpdate({ transcript: e.target.value })}
      placeholder="Optional transcript"
    />
    <SubQuestionsEditor
      questions={block.questions || []}
      onChange={(q) => onUpdate({ questions: q })}
    />
  </div>
);

export const ListeningPreview = ({ block }: BlockPreviewProps<ListeningBlock>) => {
  const [plays, setPlays] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const transcriptVisibility = block.transcriptVisibility || 'hidden';
  const showTranscript =
    transcriptVisibility === 'always' ||
    (transcriptVisibility === 'after-answer' && hasInteracted);

  return (
    <div className="my-6 p-6 border border-slate-200 bg-white rounded-2xl shadow-sm space-y-5">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 bg-slate-900 text-lime-400 rounded-full flex items-center justify-center text-xl shrink-0">
          🎧
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800 uppercase">Audio Track</p>
          <p className="text-[10px] text-slate-400 font-mono">
            Max plays: {block.maxPlays || 'Unlimited'}
          </p>
        </div>
        <button
          onClick={() => setPlays((p) => p + 1)}
          className="px-5 py-2 bg-lime-100 text-lime-800 font-bold text-xs rounded-xl hover:bg-lime-200"
        >
          Play ({plays})
        </button>
      </div>
      {block.contextImageUrl && (
        <img
          src={block.contextImageUrl}
          className="w-full h-32 object-cover rounded-xl border"
          alt="Context"
        />
      )}
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
            {block.transcript}
          </p>
        </div>
      )}
    </div>
  );
};
