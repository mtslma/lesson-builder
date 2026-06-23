import type {
  BlockFormProps,
  BlockPreviewProps,
  ImageNumberingBlock
} from '../types/index';

export const ImageNumberingForm = ({ block, onUpdate }: BlockFormProps<ImageNumberingBlock>) => {
  const addItem = () =>
    onUpdate({
      items: [
        ...block.items,
        { id: crypto.randomUUID(), imageUrl: '', correctNumber: 1, label: '' }
      ]
    });

  const removeItem = (index: number) =>
    onUpdate({ items: block.items.filter((_, itemIndex) => itemIndex !== index) });

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Title"
      />
      <div className="grid grid-cols-2 gap-2">
        {block.items.map((item, index) => (
          <div key={item.id} className="space-y-1 rounded border bg-slate-50 p-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={item.imageUrl}
              onChange={(e) => {
                const nextItems = [...block.items];
                nextItems[index].imageUrl = e.target.value;
                onUpdate({ items: nextItems });
              }}
              placeholder="Image URL"
            />
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={item.label}
              onChange={(e) => {
                const nextItems = [...block.items];
                nextItems[index].label = e.target.value;
                onUpdate({ items: nextItems });
              }}
              placeholder="Label"
            />
            <input
              type="number"
              className="w-full rounded border p-1 text-xs"
              value={item.correctNumber}
              onChange={(e) => {
                const nextItems = [...block.items];
                nextItems[index].correctNumber = Number(e.target.value);
                onUpdate({ items: nextItems });
              }}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-xs font-bold text-blue-600">
        + Add Image
      </button>
    </div>
  );
};

export const ImageNumberingPreview = ({ block }: BlockPreviewProps<ImageNumberingBlock>) => (
  <div className="my-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
    <span className="block border-b pb-2 font-mono text-[10px] font-bold uppercase text-slate-400">
      {block.title}
    </span>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Routine List
        </div>
        <div className="mt-3 space-y-2">
          {block.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                {item.correctNumber}
              </span>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {block.items.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center rounded-xl border bg-slate-50 p-3"
          >
            <input
              type="text"
              maxLength={2}
              className="absolute left-2 top-2 h-8 w-8 rounded-lg border-2 border-slate-300 bg-white text-center text-xs font-bold text-lime-600 outline-none shadow-xs focus:border-lime-500"
              placeholder="#"
            />
            <img
              src={item.imageUrl}
              alt=""
              className="h-28 w-full rounded-lg bg-slate-200 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);
