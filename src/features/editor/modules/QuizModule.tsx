import React, { useState } from 'react';

export const FillBlankForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.instruction || ''}
      onChange={(e) => onUpdate({ instruction: e.target.value })}
      placeholder="Instruction"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-20"
      value={block.textWithGaps}
      onChange={(e) => onUpdate({ textWithGaps: e.target.value })}
      placeholder="Hello, I [am] happy."
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={(block.supportWords || []).join(', ')}
      onChange={(e) =>
        onUpdate({
          supportWords: e.target.value
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        })
      }
      placeholder="Word Box (comma separated)"
    />
  </div>
);

export const SelectionGridForm: React.FC<any> = ({ block, onUpdate }) => {
  const addItem = () =>
    onUpdate({
      items: [...(block.items || []), { id: crypto.randomUUID(), text: '', isCorrect: false }]
    });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction..."
      />
      <label className="flex items-center gap-2 text-xs font-bold">
        <input
          type="checkbox"
          checked={block.isMultiSelect}
          onChange={(e) => onUpdate({ isMultiSelect: e.target.checked })}
        />{' '}
        Multi-select?
      </label>
      <div className="grid grid-cols-2 gap-2">
        {(block.items || []).map((it: any, i: number) => (
          <div key={it.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={it.text}
              onChange={(e) => {
                const n = [...block.items];
                n[i].text = e.target.value;
                onUpdate({ items: n });
              }}
              placeholder="Text"
            />
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={it.imageUrl || ''}
              onChange={(e) => {
                const n = [...block.items];
                n[i].imageUrl = e.target.value;
                onUpdate({ items: n });
              }}
              placeholder="Img URL"
            />
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={!!it.isCorrect}
                onChange={(e) => {
                  const n = [...block.items];
                  n[i].isCorrect = e.target.checked;
                  onUpdate({ items: n });
                }}
              />{' '}
              Correct?
            </label>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">
        + Add Option
      </button>
    </div>
  );
};

export const MultipleChoiceForm: React.FC<any> = ({ block, onUpdate }) => {
  const addOption = () =>
    onUpdate({
      options: [...(block.options || []), { id: crypto.randomUUID(), text: '', isCorrect: false }]
    });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Question..."
      />
      <div className="space-y-1">
        {(block.options || []).map((o: any, i: number) => (
          <div key={o.id} className="flex items-center gap-2 border p-1 rounded bg-slate-50">
            <input
              type="checkbox"
              checked={!!o.isCorrect}
              onChange={(e) => {
                const n = [...block.options];
                n[i].isCorrect = e.target.checked;
                onUpdate({ options: n });
              }}
            />
            <input
              type="text"
              className="flex-1 p-1 text-xs border rounded"
              value={o.text}
              onChange={(e) => {
                const n = [...block.options];
                n[i].text = e.target.value;
                onUpdate({ options: n });
              }}
              placeholder="Option text"
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="text-xs text-blue-600 font-bold">
        + Add Option
      </button>
    </div>
  );
};

export const ImageChoiceForm: React.FC<any> = ({ block, onUpdate }) => {
  const addOption = () =>
    onUpdate({
      options: [...(block.options || []), { id: crypto.randomUUID(), text: '', imageUrl: '' }]
    });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Question..."
      />
      <div className="grid grid-cols-2 gap-2">
        {(block.options || []).map((opt: any, i: number) => (
          <div key={opt.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={opt.text}
              onChange={(e) => {
                const n = [...block.options];
                n[i].text = e.target.value;
                onUpdate({ options: n });
              }}
              placeholder="Text"
            />
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={opt.imageUrl || ''}
              onChange={(e) => {
                const n = [...block.options];
                n[i].imageUrl = e.target.value;
                onUpdate({ options: n });
              }}
              placeholder="Img URL"
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="text-xs text-blue-600 font-bold">
        + Add Option
      </button>
    </div>
  );
};

export const RewriteQuestionForm: React.FC<any> = ({ block, onUpdate }) => {
  const addExample = () =>
    onUpdate({ examples: [...(block.examples || []), { input: '', output: '' }] });
  const addItem = () => onUpdate({ items: [...(block.items || []), ''] });
  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction"
      />
      <div className="border p-2 rounded bg-slate-50 space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">Examples</span>
        {(block.examples || []).map((ex: any, i: number) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-1 text-xs border rounded"
              value={ex.input}
              onChange={(e) => {
                const n = [...block.examples!];
                n[i].input = e.target.value;
                onUpdate({ examples: n });
              }}
              placeholder="Input"
            />
            <input
              type="text"
              className="flex-1 p-1 text-xs border rounded text-lime-700 bg-lime-50"
              value={ex.output}
              onChange={(e) => {
                const n = [...block.examples!];
                n[i].output = e.target.value;
                onUpdate({ examples: n });
              }}
              placeholder="Output"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExample}
          className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold"
        >
          + Add Example
        </button>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">Items</span>
        {(block.items || []).map((it: string, i: number) => (
          <input
            key={i}
            type="text"
            className="w-full p-1.5 text-xs border rounded"
            value={it}
            onChange={(e) => {
              const n = [...block.items];
              n[i] = e.target.value;
              onUpdate({ items: n });
            }}
          />
        ))}
        <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">
          + Add Item
        </button>
      </div>
    </div>
  );
};

export const ImageNumberingForm: React.FC<any> = ({ block, onUpdate }) => {
  const addItem = () =>
    onUpdate({
      items: [
        ...(block.items || []),
        { id: crypto.randomUUID(), imageUrl: '', correctNumber: 1, label: '' }
      ]
    });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title"
      />
      <div className="grid grid-cols-2 gap-2">
        {(block.items || []).map((it: any, i: number) => (
          <div key={it.id} className="border p-2 rounded bg-slate-50 space-y-1">
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={it.imageUrl}
              onChange={(e) => {
                const n = [...block.items];
                n[i].imageUrl = e.target.value;
                onUpdate({ items: n });
              }}
              placeholder="Image URL"
            />
            <input
              type="text"
              className="w-full p-1 border rounded text-xs"
              value={it.label}
              onChange={(e) => {
                const n = [...block.items];
                n[i].label = e.target.value;
                onUpdate({ items: n });
              }}
              placeholder="Label"
            />
            <input
              type="number"
              className="w-full p-1 border rounded text-xs"
              value={it.correctNumber}
              onChange={(e) => {
                const n = [...block.items];
                n[i].correctNumber = Number(e.target.value);
                onUpdate({ items: n });
              }}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold">
        + Add Image
      </button>
    </div>
  );
};

export const FillBlankPreview: React.FC<any> = ({ block }) => (
  <div className="p-6 bg-slate-50 border-l-4 border-lime-500 rounded-r-xl my-6 shadow-sm">
    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 font-bold">
      {block.instruction || 'Fill the gaps'}
    </p>
    <div className="text-slate-800 text-sm font-serif leading-loose flex flex-wrap items-center gap-y-2">
      {block.textWithGaps
        .split(/(\[[^\]]+\])/g)
        .map((part: string, i: number) =>
          part.startsWith('[') ? (
            <input
              key={i}
              type="text"
              style={{ width: `${Math.max(part.length, 5)}ch` }}
              className="mx-1 px-2 py-0.5 border-b-2 border-slate-300 font-sans font-bold text-center text-lime-700 focus:border-lime-500 outline-none rounded-t-md bg-white shadow-xs"
              placeholder="..."
            />
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </div>
    {block.supportWords && block.supportWords.length > 0 && (
      <div className="mt-5 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">Word Box:</span>
        {block.supportWords.map((sw: string, i: number) => (
          <span
            key={i}
            className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-semibold shadow-2xs"
          >
            {sw}
          </span>
        ))}
      </div>
    )}
  </div>
);

export const SelectionGridPreview: React.FC<any> = ({ block }) => {
  const [gridAnswers, setGridAnswers] = useState<Record<string, 'correct' | 'incorrect'>>({});
  return (
    <div className="my-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
      <p className="text-[10px] font-bold text-slate-400 font-mono uppercase border-b pb-2">
        Click & Check: {block.instruction}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {block.items.map((it: any) => {
          const status = gridAnswers[it.id];
          return (
            <button
              key={it.id}
              onClick={() =>
                setGridAnswers((p) => ({ ...p, [it.id]: it.isCorrect ? 'correct' : 'incorrect' }))
              }
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${status === 'correct' ? 'border-lime-500 bg-lime-50' : status === 'incorrect' ? 'border-red-400 bg-red-50 opacity-60' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
            >
              {status === 'correct' && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-lime-500 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </div>
              )}
              {status === 'incorrect' && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✕
                </div>
              )}
              {it.imageUrl && (
                <img
                  src={it.imageUrl}
                  alt=""
                  className="w-12 h-12 mb-2 rounded-full object-cover shadow-xs border"
                />
              )}
              <span
                className={`text-sm font-bold font-sans ${status === 'incorrect' ? 'line-through text-red-400' : ''}`}
              >
                {it.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ImageChoicePreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 bg-white border rounded-2xl shadow-sm space-y-4">
    <p className="text-sm font-bold text-slate-800 font-serif">{block.question}</p>
    <div className="grid grid-cols-2 gap-3">
      {block.options.map((opt: any) => (
        <div
          key={opt.id}
          className="flex flex-col items-center p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-colors"
        >
          {opt.imageUrl && (
            <img src={opt.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
          )}
          <span className="text-xs font-bold text-slate-700">{opt.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export const MultipleChoicePreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-5 border bg-slate-50 rounded-2xl shadow-sm space-y-3">
    <p className="text-sm font-bold text-slate-800 font-serif">{block.question}</p>
    <div className="space-y-2">
      {block.options.map((o: any) => (
        <label
          key={o.id}
          className="flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-lime-400"
        >
          <input type="radio" name={block.id} className="w-4 h-4 text-lime-600" />
          <span className="text-sm font-medium text-slate-700">{o.text}</span>
        </label>
      ))}
    </div>
  </div>
);

export const RewriteQuestionPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border rounded-2xl shadow-sm space-y-4 bg-white">
    <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest border-b pb-2">
      {block.instruction}
    </p>
    {block.examples?.map((ex: any, i: number) => (
      <div key={i} className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 border">
        <span className="font-bold text-slate-800 mr-2">Ex:</span>
        {ex.input} <span className="text-lime-600 font-bold mx-2">&rarr;</span> {ex.output}
      </div>
    ))}
    <div className="space-y-3 pt-2">
      {block.items.map((it: string, i: number) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {i + 1}. {it}
          </span>
          <input
            type="text"
            className="w-full p-2 border rounded-lg outline-none focus:border-lime-500 text-sm font-sans"
            placeholder="Rewrite here..."
          />
        </div>
      ))}
    </div>
  </div>
);

export const ImageNumberingPreview: React.FC<any> = ({ block }) => (
  <div className="my-6 p-6 border rounded-2xl bg-white shadow-sm space-y-4">
    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase border-b pb-2 block">
      {block.title}
    </span>
    <div className="grid grid-cols-2 gap-4">
      {block.items.map((it: any, i: number) => (
        <div
          key={i}
          className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border relative"
        >
          <input
            type="text"
            maxLength={2}
            className="absolute top-2 left-2 w-7 h-7 border-2 border-slate-300 text-center rounded bg-white text-xs font-bold outline-none text-lime-600 focus:border-lime-500 shadow-xs"
            placeholder="?"
          />
          <img
            src={it.imageUrl}
            alt=""
            className="w-16 h-16 object-cover rounded-lg bg-slate-200 mb-2"
          />
          <span className="text-xs font-bold text-slate-700 text-center">{it.label}</span>
        </div>
      ))}
    </div>
  </div>
);
