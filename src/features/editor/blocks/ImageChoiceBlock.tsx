import { useState } from 'react';
import { createPreviewStorageKey } from '../domain/previewState';
import type { BlockFormProps, BlockPreviewProps, ImageChoiceBlock } from '../types/index';
import { createImageChoiceOption } from '../domain/blockDefaults';
import { removeItemAt, updateItemAt } from '../domain/collections';
import { usePersistedPreviewState } from '../hooks/usePersistedPreviewState';
import { shuffleArray } from '../domain/shuffle';

export const ImageChoiceForm = ({ block, onUpdate }: BlockFormProps<ImageChoiceBlock>) => {
  const addOption = () =>
    onUpdate({
      options: [...block.options, createImageChoiceOption()]
    });

  const removeOption = (index: number) =>
    onUpdate({ options: removeItemAt(block.options, index) });

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
                onUpdate({
                  options: updateItemAt(block.options, index, (option) => ({
                    ...option,
                    text: e.target.value
                  }))
                });
              }}
              placeholder="Text"
            />
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={option.imageUrl || ''}
              onChange={(e) => {
                onUpdate({
                  options: updateItemAt(block.options, index, (option) => ({
                    ...option,
                    imageUrl: e.target.value
                  }))
                });
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

export const ImageChoicePreview = ({ block }: BlockPreviewProps<ImageChoiceBlock>) => {
  const [shuffledOptions] = useState(() => shuffleArray(block.options, `${block.id}:image-choice`));
  const [selectedOptionId, setSelectedOptionId] = usePersistedPreviewState<string>(
    createPreviewStorageKey(block.id, 'image-choice.answer'),
    ''
  );

  return (
    <div className="my-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <p className="font-serif text-sm font-bold text-slate-800">{block.question}</p>
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedOptionId(option.id)}
            className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-3 transition-colors ${
              selectedOptionId === option.id
                ? 'border-lime-500 bg-lime-50'
                : 'border-slate-100 hover:border-lime-400 hover:bg-lime-50'
            }`}
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
};
