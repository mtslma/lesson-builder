import React, { useState } from 'react';
import { SubQuestionsEditor, RenderSubQuestionsPreview } from './Shared';

export const MediaForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.url}
      onChange={(e) => onUpdate({ url: e.target.value })}
      placeholder="Media URL"
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.numbering || ''}
      onChange={(e) => onUpdate({ numbering: e.target.value })}
      placeholder="Caption / Numbering"
    />
  </div>
);

export const ListeningForm: React.FC<any> = ({ block, onUpdate }) => (
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
    <SubQuestionsEditor
      questions={block.questions || []}
      onChange={(q) => onUpdate({ questions: q })}
    />
  </div>
);

export const ReadingComprehensionForm: React.FC<any> = ({ block, onUpdate }) => (
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
    <SubQuestionsEditor questions={block.questions} onChange={(q) => onUpdate({ questions: q })} />
  </div>
);

export const MediaPreview: React.FC<any> = ({ block }) => (
  <div
    className={`my-6 flex flex-col ${block.position === 'left' ? 'items-start' : block.position === 'right' ? 'items-end' : 'items-center'}`}
  >
    {block.numbering && (
      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
        {block.numbering}
      </span>
    )}
    <img
      src={block.url}
      alt=""
      className="rounded-xl border border-slate-200 max-h-64 object-cover shadow-sm bg-slate-50"
    />
  </div>
);

export const ListeningPreview: React.FC<any> = ({ block }) => {
  const [plays, setPlays] = useState(0);
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
      <RenderSubQuestionsPreview questions={block.questions} />
    </div>
  );
};

export const ReadingComprehensionPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
    <div className="bg-slate-50 p-6 border-b">
      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
        Reading Practice
      </span>
      <h3 className="text-xl font-serif font-bold mt-2">{block.title}</h3>
    </div>
    <div className="p-6">
      <p className="text-base text-slate-700 font-serif leading-loose border-l-4 border-slate-300 pl-4 mb-6 whitespace-pre-wrap">
        {block.text}
      </p>
      <RenderSubQuestionsPreview questions={block.questions} />
    </div>
  </div>
);
