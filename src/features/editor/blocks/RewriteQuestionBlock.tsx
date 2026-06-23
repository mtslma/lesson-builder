import type {
  BlockFormProps,
  BlockPreviewProps,
  RewriteQuestionBlock
} from '../types/index';

export const RewriteQuestionForm = ({ block, onUpdate }: BlockFormProps<RewriteQuestionBlock>) => {
  const addExample = () => onUpdate({ examples: [...(block.examples || []), { input: '', output: '' }] });
  const addItem = () => onUpdate({ items: [...block.items, ''] });

  const removeExample = (index: number) =>
    onUpdate({ examples: (block.examples || []).filter((_, exampleIndex) => exampleIndex !== index) });

  const removeItem = (index: number) =>
    onUpdate({ items: block.items.filter((_, itemIndex) => itemIndex !== index) });

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.instruction}
        onChange={(e) => onUpdate({ instruction: e.target.value })}
        placeholder="Instruction"
      />
      <div className="space-y-1 rounded border bg-slate-50 p-2">
        <span className="text-[10px] font-bold uppercase text-slate-500">Examples</span>
        {(block.examples || []).map((example, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded border p-1 text-xs"
              value={example.input}
              onChange={(e) => {
                const nextExamples = [...(block.examples || [])];
                nextExamples[index].input = e.target.value;
                onUpdate({ examples: nextExamples });
              }}
              placeholder="Input"
            />
            <input
              type="text"
              className="flex-1 rounded border bg-lime-50 p-1 text-xs text-lime-700"
              value={example.output}
              onChange={(e) => {
                const nextExamples = [...(block.examples || [])];
                nextExamples[index].output = e.target.value;
                onUpdate({ examples: nextExamples });
              }}
              placeholder="Output"
            />
            <button
              type="button"
              onClick={() => removeExample(index)}
              className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExample}
          className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold"
        >
          + Add Example
        </button>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">Items</span>
        {block.items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="w-full rounded border p-1.5 text-xs"
              value={item}
              onChange={(e) => {
                const nextItems = [...block.items];
                nextItems[index] = e.target.value;
                onUpdate({ items: nextItems });
              }}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-xs font-bold text-blue-600">
          + Add Item
        </button>
      </div>
    </div>
  );
};

export const RewriteQuestionPreview = ({ block }: BlockPreviewProps<RewriteQuestionBlock>) => (
  <div className="my-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
    <p className="border-b pb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {block.instruction}
    </p>
    {block.examples?.map((example, index) => (
      <div key={index} className="rounded-lg border bg-slate-50 p-3 font-mono text-xs text-slate-600">
        <span className="mr-2 font-bold text-slate-800">Ex:</span>
        {example.input} <span className="mx-2 font-bold text-lime-600">{'->'}</span>{' '}
        {example.output}
      </div>
    ))}
    <div className="space-y-3 pt-2">
      {block.items.map((item, index) => (
        <div key={index} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {index + 1}. {item}
          </span>
          <input
            type="text"
            className="w-full rounded-lg border p-2 font-sans text-sm outline-none focus:border-lime-500"
            placeholder="Rewrite here..."
          />
        </div>
      ))}
    </div>
  </div>
);
