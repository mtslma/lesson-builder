import type {
  BlockFormProps,
  BlockPreviewProps,
  PhrasalVerbFocusBlock
} from '../types/index';

type PhrasalVerbItem = PhrasalVerbFocusBlock['items'][number];

export const PhrasalVerbForm = ({ block, onUpdate }: BlockFormProps<PhrasalVerbFocusBlock>) => {
  const items = block.items.slice(0, 6);

  const updateItem = <K extends keyof PhrasalVerbItem>(
    index: number,
    field: K,
    value: PhrasalVerbItem[K]
  ) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onUpdate({ items: nextItems });
  };

  const addItem = () => {
    if (items.length >= 6) return;
    onUpdate({
      items: [...items, { id: crypto.randomUUID(), verb: '', meaning: '', examples: [] }]
    });
  };

  const removeItem = (index: number) =>
    onUpdate({ items: items.filter((_, itemIndex) => itemIndex !== index) });

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Context title"
      />
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Phrasal Verb {index + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            className="w-full rounded border p-2 text-sm font-bold text-lime-700"
            value={item.verb}
            onChange={(e) => updateItem(index, 'verb', e.target.value)}
            placeholder="Phrasal verb"
          />
          <input
            type="text"
            className="w-full rounded border p-2 text-sm"
            value={item.meaning}
            onChange={(e) => updateItem(index, 'meaning', e.target.value)}
            placeholder="Meaning"
          />
          <textarea
            className="h-16 w-full rounded border p-2 text-sm"
            value={item.examples.join('\n')}
            onChange={(e) =>
              updateItem(
                index,
                'examples',
                e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
              )
            }
            placeholder="Examples (one per line)"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        disabled={items.length >= 6}
        className="text-xs font-bold text-blue-600 disabled:opacity-40"
      >
        + Add Phrasal Verb
      </button>
    </div>
  );
};

export const PhrasalVerbPreview = ({ block }: BlockPreviewProps<PhrasalVerbFocusBlock>) => {
  const items =
    block.items.length > 0
      ? block.items
      : [
          {
            id: block.id,
            verb: block.verb || '',
            meaning: block.meaning || '',
            examples: block.examples || []
          }
        ];

  return (
    <div className="my-6 rounded-2xl border border-lime-300 bg-lime-50/40 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-lime-200 pb-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lime-700">
            Phrasal Verb Focus
          </div>
          {block.title && <h3 className="mt-1 text-lg font-semibold text-lime-950">{block.title}</h3>}
        </div>
        <span className="rounded-full bg-lime-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-xl border border-lime-200 bg-white/80 p-4"
          >
            <h4 className="text-xl font-semibold text-lime-900">{item.verb}</h4>
            <p className="mt-1 text-sm font-medium text-lime-700">{item.meaning}</p>
            <ul className="mt-3 space-y-2">
              {item.examples.map((example, exampleIndex) => (
                <li key={exampleIndex} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 text-lime-500">*</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
