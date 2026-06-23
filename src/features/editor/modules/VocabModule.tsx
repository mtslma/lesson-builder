import React, { useState } from 'react';

export const VocabularyMatchForm: React.FC<any> = ({ block, onUpdate }) => {
  const addPair = () =>
    onUpdate({ pairs: [...block.pairs, { left: '', leftType: 'text', right: '' }] });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title..."
      />
      {(block.pairs || []).map((p: any, i: number) => (
        <div key={i} className="flex gap-1 border p-1 rounded bg-slate-50">
          <select
            className="text-xs border rounded"
            value={p.leftType}
            onChange={(e) => {
              const n = [...block.pairs];
              n[i].leftType = e.target.value;
              onUpdate({ pairs: n });
            }}
          >
            <option value="text">TXT</option>
            <option value="image">IMG</option>
          </select>
          <input
            type="text"
            className="flex-1 p-1 border rounded text-xs"
            value={p.left}
            onChange={(e) => {
              const n = [...block.pairs];
              n[i].left = e.target.value;
              onUpdate({ pairs: n });
            }}
            placeholder="Left"
          />
          <input
            type="text"
            className="flex-1 p-1 border rounded text-xs"
            value={p.right}
            onChange={(e) => {
              const n = [...block.pairs];
              n[i].right = e.target.value;
              onUpdate({ pairs: n });
            }}
            placeholder="Right"
          />
        </div>
      ))}
      <button type="button" onClick={addPair} className="text-xs text-blue-600 font-bold">
        + Add Pair
      </button>
    </div>
  );
};

export const FlashcardsForm: React.FC<any> = ({ block, onUpdate }) => {
  const addCard = () =>
    onUpdate({
      cards: [...(block.cards || []), { id: crypto.randomUUID(), frontText: '', backText: '' }]
    });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Deck Title"
      />
      {(block.cards || []).map((card: any, i: number) => (
        <div key={card.id} className="bg-slate-50 border p-2 rounded space-y-1">
          <input
            type="text"
            className="w-full p-1.5 border rounded text-xs font-bold"
            value={card.frontText || ''}
            onChange={(e) => {
              const n = [...block.cards];
              n[i].frontText = e.target.value;
              onUpdate({ cards: n });
            }}
            placeholder="Front Text"
          />
          <input
            type="text"
            className="w-full p-1.5 border rounded text-xs"
            value={card.frontImage || ''}
            onChange={(e) => {
              const n = [...block.cards];
              n[i].frontImage = e.target.value;
              onUpdate({ cards: n });
            }}
            placeholder="Front Image URL"
          />
          <input
            type="text"
            className="w-full p-1.5 border rounded text-xs text-lime-700 bg-lime-50"
            value={card.backText}
            onChange={(e) => {
              const n = [...block.cards];
              n[i].backText = e.target.value;
              onUpdate({ cards: n });
            }}
            placeholder="Back Text"
          />
        </div>
      ))}
      <button type="button" onClick={addCard} className="text-xs text-blue-600 font-bold">
        + Add Card
      </button>
    </div>
  );
};

export const RepetitionDrillForm: React.FC<any> = ({ block, onUpdate }) => {
  const addWord = () => onUpdate({ words: [...block.words, { word: '' }] });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title"
      />
      {block.words.map((w: any, i: number) => (
        <div key={i} className="flex gap-2 border p-2 rounded bg-slate-50">
          <input
            type="text"
            className="w-1/3 p-1 border rounded text-xs font-bold"
            value={w.word}
            onChange={(e) => {
              const n = [...block.words];
              n[i].word = e.target.value;
              onUpdate({ words: n });
            }}
            placeholder="Word"
          />
          <input
            type="text"
            className="w-1/3 p-1 border rounded text-xs font-mono"
            value={w.phonetic || ''}
            onChange={(e) => {
              const n = [...block.words];
              n[i].phonetic = e.target.value;
              onUpdate({ words: n });
            }}
            placeholder="/Phonetic/"
          />
          <input
            type="text"
            className="w-1/3 p-1 border rounded text-xs"
            value={w.translation || ''}
            onChange={(e) => {
              const n = [...block.words];
              n[i].translation = e.target.value;
              onUpdate({ words: n });
            }}
            placeholder="Translation"
          />
        </div>
      ))}
      <button type="button" onClick={addWord} className="text-xs text-blue-600 font-bold">
        + Add Word
      </button>
    </div>
  );
};

export const PhrasalVerbForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold text-lime-700"
      value={block.verb}
      onChange={(e) => onUpdate({ verb: e.target.value })}
      placeholder="Phrasal Verb"
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.meaning}
      onChange={(e) => onUpdate({ meaning: e.target.value })}
      placeholder="Meaning"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-16"
      value={block.examples.join('\n')}
      onChange={(e) => onUpdate({ examples: e.target.value.split('\n').filter(Boolean) })}
      placeholder="Examples (One per line)"
    />
  </div>
);

export const VocabularyMatchPreview: React.FC<any> = ({ block }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  return (
    <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
          Connect: {block.title}
        </span>
        <span className="text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded">
          {Object.keys(matchedPairs).length} / {block.pairs.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {block.pairs.map((p: any, i: number) => {
            const matched = !!matchedPairs[p.left];
            const selected = selectedLeft === p.left;
            return (
              <div
                key={i}
                onClick={() => !matched && setSelectedLeft(p.left)}
                className={`border rounded-xl p-2 flex items-center justify-center min-h-[50px] cursor-pointer transition-all ${matched ? 'bg-slate-200 opacity-50 border-slate-300' : selected ? 'bg-lime-100 border-lime-500 shadow-md scale-105' : 'bg-white border-slate-200'}`}
              >
                {p.leftType === 'image' ? (
                  <img src={p.left} className="h-8 rounded" alt="" />
                ) : (
                  <span className="text-sm font-bold">{p.left}</span>
                )}
                {matched && <span className="absolute ml-24 text-lime-500 font-bold">✓</span>}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {block.pairs.map((p: any, i: number) => {
            const matched = Object.values(matchedPairs).includes(p.right);
            return (
              <div
                key={i}
                onClick={() => {
                  if (
                    selectedLeft &&
                    block.pairs.find((x: any) => x.left === selectedLeft)?.right === p.right
                  ) {
                    setMatchedPairs((prev) => ({ ...prev, [selectedLeft]: p.right }));
                    setSelectedLeft(null);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-2 flex items-center justify-center min-h-[50px] cursor-pointer transition-all ${matched ? 'bg-lime-50 border-lime-300 text-lime-600' : selectedLeft ? 'bg-white border-lime-400' : 'border-slate-300'}`}
              >
                <span className="text-sm font-bold">{p.right}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const FlashcardsPreview: React.FC<any> = ({ block }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  if (!block.cards || block.cards.length === 0) return null;
  const currentCard = block.cards[currentIndex];
  return (
    <div className="my-6 p-6 bg-slate-50 border rounded-2xl text-center space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-[10px] font-mono tracking-wider font-bold uppercase">
          {block.title}
        </span>
        <span className="text-xs font-mono">
          {currentIndex + 1} / {block.cards.length}
        </span>
      </div>
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full max-w-[320px] h-44 mx-auto perspective cursor-pointer"
      >
        <div
          className={`relative w-full h-full duration-300 transform-style ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          <div className="absolute inset-0 bg-white border rounded-xl flex flex-col items-center justify-center p-4 backface-hidden shadow-xs">
            {currentCard.frontImage ? (
              <img
                src={currentCard.frontImage}
                alt=""
                className="max-h-28 rounded-lg object-cover"
              />
            ) : (
              <p className="text-base font-serif font-bold">{currentCard.frontText}</p>
            )}
          </div>
          <div className="absolute inset-0 bg-slate-900 text-lime-400 border rounded-xl flex items-center justify-center p-4 backface-hidden rotate-y-180 shadow-md">
            <p className="text-sm font-sans font-bold">{currentCard.backText}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 pt-1">
        <button
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex((p) => p - 1);
            setIsFlipped(false);
          }}
          className="px-3 py-1 bg-white border rounded-md text-xs font-bold disabled:opacity-40"
        >
          &larr; Prev
        </button>
        <button
          disabled={currentIndex === block.cards.length - 1}
          onClick={() => {
            setCurrentIndex((p) => p + 1);
            setIsFlipped(false);
          }}
          className="px-3 py-1 bg-white border rounded-md text-xs font-bold disabled:opacity-40"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export const RepetitionDrillPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border rounded-2xl shadow-sm bg-white">
    <span className="text-[10px] font-black uppercase tracking-widest font-mono block mb-4">
      🎙️ Pronunciation: {block.title}
    </span>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {block.words.map((w: any, i: number) => (
        <div
          key={i}
          className="flex flex-col p-3 border rounded-xl bg-slate-50 hover:border-lime-400 group"
        >
          <span className="text-base font-bold">{w.word}</span>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-slate-400">{w.phonetic}</span>
            <span className="text-xs font-medium text-slate-500 italic opacity-0 group-hover:opacity-100">
              {w.translation}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PhrasalVerbPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border-2 border-lime-500 bg-lime-50/30 rounded-2xl shadow-sm relative overflow-hidden">
    <div className="absolute top-0 right-0 bg-lime-500 text-white text-[9px] font-black px-3 py-1 uppercase rounded-bl-xl">
      Phrasal Verb
    </div>
    <h3 className="text-2xl font-black text-lime-900">{block.verb}</h3>
    <p className="text-sm font-bold text-lime-700 uppercase mb-4 border-b border-lime-200 pb-2">
      {block.meaning}
    </p>
    <ul className="space-y-2">
      {block.examples.map((ex: string, i: number) => (
        <li key={i} className="text-sm font-serif text-slate-700 flex items-start gap-2">
          <span className="text-lime-500 font-bold mt-1">•</span>
          <span className="flex-1">{ex}</span>
        </li>
      ))}
    </ul>
  </div>
);
