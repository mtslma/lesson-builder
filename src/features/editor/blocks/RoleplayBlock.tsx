import type { BlockFormProps, BlockPreviewProps, RoleplayBlock } from '../types/index';
import { removeItemAt, updateItemAt } from '../domain/collections';

type RoleplayCharacter = RoleplayBlock['characters'][number];
type RoleplayDetail = RoleplayCharacter['details'][number];

const createCharacter = (): RoleplayCharacter => ({
  name: '',
  details: []
});

const createDetail = (): RoleplayDetail => ({
  label: '',
  value: ''
});

export const RoleplayForm = ({ block, onUpdate }: BlockFormProps<RoleplayBlock>) => {
  const addChar = () => onUpdate({ characters: [...block.characters, createCharacter()] });

  const removeChar = (index: number) =>
    onUpdate({ characters: removeItemAt(block.characters, index) });

  const addDetail = (characterIndex: number) => {
    const character = block.characters[characterIndex];

    onUpdate({
      characters: updateItemAt(block.characters, characterIndex, (currentCharacter) => ({
        ...currentCharacter,
        details: [...character.details, createDetail()]
      }))
    });
  };

  const removeDetail = (characterIndex: number, detailIndex: number) => {
    onUpdate({
      characters: updateItemAt(block.characters, characterIndex, (character) => ({
        ...character,
        details: removeItemAt(character.details, detailIndex)
      }))
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="block text-[10px] font-bold uppercase text-slate-500">Characters</span>
        {block.characters.map((character, index) => (
          <div key={index} className="space-y-2 rounded border bg-slate-50 p-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeChar(index)}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              className="w-full rounded border p-1.5 text-xs font-bold"
              value={character.name}
              onChange={(e) =>
                onUpdate({
                  characters: updateItemAt(block.characters, index, (currentCharacter) => ({
                    ...currentCharacter,
                    name: e.target.value
                  }))
                })
              }
              placeholder="Character Name"
            />

            <div className="space-y-2">
              {character.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex gap-2">
                  <input
                    type="text"
                    className="w-32 rounded border p-1.5 text-xs"
                    value={detail.label}
                    onChange={(e) =>
                      onUpdate({
                        characters: updateItemAt(block.characters, index, (currentCharacter) => ({
                          ...currentCharacter,
                          details: updateItemAt(currentCharacter.details, detailIndex, (currentDetail) => ({
                            ...currentDetail,
                            label: e.target.value
                          }))
                        }))
                      })
                    }
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    className="flex-1 rounded border p-1.5 text-xs"
                    value={detail.value}
                    onChange={(e) =>
                      onUpdate({
                        characters: updateItemAt(block.characters, index, (currentCharacter) => ({
                          ...currentCharacter,
                          details: updateItemAt(currentCharacter.details, detailIndex, (currentDetail) => ({
                            ...currentDetail,
                            value: e.target.value
                          }))
                        }))
                      })
                    }
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeDetail(index, detailIndex)}
                    className="rounded border border-red-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addDetail(index)}
                className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold"
              >
                + Add item
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addChar}
          className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold"
        >
          + Add Character
        </button>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] font-bold uppercase text-slate-500">Tips</span>
        <textarea
          className="h-20 w-full rounded border p-2 text-sm"
          value={block.tips}
          onChange={(e) => onUpdate({ tips: e.target.value })}
          placeholder="Optional tips for the roleplay"
        />
      </div>
    </div>
  );
};

export const RoleplayPreview = ({ block }: BlockPreviewProps<RoleplayBlock>) => (
  <div className="my-8 space-y-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-sm">
    <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-indigo-500">
      Roleplay Cards
    </span>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {block.characters.map((character, index) => (
        <div
          key={index}
          className="space-y-2 rounded-xl border border-indigo-100 bg-white p-4 shadow-xs"
        >
          <p className="font-bold text-slate-900">{character.name}</p>
          {character.details
            .filter((detail) => detail.label.trim().length > 0 || detail.value.trim().length > 0)
            .map((detail, detailIndex) => (
              <p key={detailIndex} className="text-xs text-slate-500">
                {detail.label.trim().length > 0 && (
                  <strong className="text-indigo-400">{detail.label}:</strong>
                )}{' '}
                {detail.value}
              </p>
            ))}
        </div>
      ))}
    </div>
    {block.tips.trim().length > 0 && (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <span className="mb-2 block text-[10px] font-bold uppercase text-slate-400">Tips</span>
        <p className="whitespace-pre-wrap font-serif text-sm text-slate-600">{block.tips}</p>
      </div>
    )}
  </div>
);
