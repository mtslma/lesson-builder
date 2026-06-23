import type { BlockFormProps, BlockPreviewProps, ImageChoiceBlock } from '../types/index';

export const ImageChoiceForm = ({ block, onUpdate }: BlockFormProps<ImageChoiceBlock>) => {
  const addOption = () =>
    onUpdate({
      options: [...block.options, { id: crypto.randomUUID(), text: '', imageUrl: '' }]
    });

  const removeOption = (index: number) =>
    onUpdate({ options: block.options.filter((_, optionIndex) => optionIndex !== index) });

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full rounded border p-2 text-sm font-bold"
        value={block.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Question..."
      />
      <div className="grid grid-cols-2 gap-2">
        {block.options.map((option, index) => (
          <div key={option.id} className="space-y-1 rounded border bg-slate-50 p-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={option.text}
              onChange={(e) => {
                const nextOptions = [...block.options];
                nextOptions[index].text = e.target.value;
                onUpdate({ options: nextOptions });
              }}
              placeholder="Text"
            />
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={option.imageUrl || ''}
              onChange={(e) => {
                const nextOptions = [...block.options];
                nextOptions[index].imageUrl = e.target.value;
                onUpdate({ options: nextOptions });
              }}
              placeholder="Img URL"
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="text-xs font-bold text-blue-600">
        + Add Option
      </button>
    </div>
  );
};

export const ImageChoicePreview = ({ block }: BlockPreviewProps<ImageChoiceBlock>) => (
  <div className="my-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
    <p className="font-serif text-sm font-bold text-slate-800">{block.question}</p>
    <div className="grid grid-cols-2 gap-3">
      {block.options.map((option) => (
        <div
          key={option.id}
          className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-slate-100 p-3 transition-colors hover:border-lime-400 hover:bg-lime-50"
        >
          {option.imageUrl && (
            <img
              src={option.imageUrl}
              alt=""
              className="mb-2 h-24 w-full rounded-lg object-cover"
            />
          )}
          <span className="text-xs font-bold text-slate-700">{option.text}</span>
        </div>
      ))}
    </div>
  </div>
);
