import React, { useState } from 'react';

export const FlashcardsForm: React.FC<any> = ({ block, onUpdate }) => {
  const addCard = () => onUpdate({ cards: [...(block.cards || []), { id: crypto.randomUUID(), frontText: '', frontImage: '', backText: '', backImage: '' }] });
  const removeCard = (index: number) => onUpdate({ cards: block.cards.filter((_: any, cardIndex: number) => cardIndex !== index) });
  return (
    <div className="space-y-2">
      <input type="text" className="w-full p-2 border rounded text-sm font-bold" value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Deck Title" />
      <input type="text" className="w-full p-2 border rounded text-sm" value={block.category || ''} onChange={(e) => onUpdate({ category: e.target.value })} placeholder="Category (optional)" />
      <input type="text" className="w-full p-2 border rounded text-sm" value={(block.tags || []).join(', ')} onChange={(e) => onUpdate({ tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean) })} placeholder="Tags (comma separated)" />
      {(block.cards || []).map((card: any, i: number) => (
        <div key={card.id} className="bg-slate-50 border p-2 rounded space-y-1">
          <div className="flex justify-end"><button type="button" onClick={() => removeCard(i)} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500">Remove</button></div>
          <input type="text" className="w-full p-1.5 border rounded text-xs font-bold" value={card.frontText || ''} onChange={(e) => {
            const n = [...block.cards];
            n[i].frontText = e.target.value;
            onUpdate({ cards: n });
          }} placeholder="Front Text" />
          <input type="text" className="w-full p-1.5 border rounded text-xs" value={card.frontImage || ''} onChange={(e) => {
            const n = [...block.cards];
            n[i].frontImage = e.target.value;
            onUpdate({ cards: n });
          }} placeholder="Front Image URL" />
          <input type="text" className="w-full p-1.5 border rounded text-xs text-lime-700 bg-lime-50" value={card.backText} onChange={(e) => {
            const n = [...block.cards];
            n[i].backText = e.target.value;
            onUpdate({ cards: n });
          }} placeholder="Back Text" />
          <input type="text" className="w-full p-1.5 border rounded text-xs" value={card.backImage || ''} onChange={(e) => {
            const n = [...block.cards];
            n[i].backImage = e.target.value;
            onUpdate({ cards: n });
          }} placeholder="Back Image URL" />
        </div>
      ))}
      <button type="button" onClick={addCard} className="text-xs text-blue-600 font-bold">+ Add Card</button>
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
        <div>
          <span className="text-[10px] font-mono tracking-wider font-bold uppercase">{block.title}</span>
          {(block.category || (block.tags && block.tags.length > 0)) && <div className="mt-2 flex flex-wrap gap-2">{block.category && <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{block.category}</span>}{(block.tags || []).map((tag: string) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{tag}</span>)}</div>}
        </div>
        <span className="text-xs font-mono">{currentIndex + 1} / {block.cards.length}</span>
      </div>
      <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-[320px] h-44 mx-auto perspective cursor-pointer">
        <div className={`relative w-full h-full duration-300 transform-style ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 bg-white border rounded-xl flex flex-col items-center justify-center p-4 backface-hidden shadow-xs">
            {currentCard.frontImage && <img src={currentCard.frontImage} alt="" className="max-h-24 rounded-lg object-cover mb-3" />}
            {currentCard.frontText && <p className="text-base font-serif font-bold">{currentCard.frontText}</p>}
          </div>
          <div className="absolute inset-0 bg-slate-900 text-lime-400 border rounded-xl flex flex-col items-center justify-center p-4 backface-hidden rotate-y-180 shadow-md">
            {currentCard.backImage && <img src={currentCard.backImage} alt="" className="max-h-24 rounded-lg object-cover mb-3" />}
            {currentCard.backText && <p className="text-sm font-sans font-bold">{currentCard.backText}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 pt-1">
        <button disabled={currentIndex === 0} onClick={() => { setCurrentIndex((p) => p - 1); setIsFlipped(false); }} className="px-3 py-1 bg-white border rounded-md text-xs font-bold disabled:opacity-40">← Prev</button>
        <button disabled={currentIndex === block.cards.length - 1} onClick={() => { setCurrentIndex((p) => p + 1); setIsFlipped(false); }} className="px-3 py-1 bg-white border rounded-md text-xs font-bold disabled:opacity-40">Next →</button>
      </div>
    </div>
  );
};
