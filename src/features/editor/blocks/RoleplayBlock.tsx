import type { BlockFormProps, BlockPreviewProps, RoleplayBlock } from '../types/index';

export const RoleplayForm = ({ block, onUpdate }: BlockFormProps<RoleplayBlock>) => {
  const addChar = () => onUpdate({ characters: [...block.characters, { name: '' }] });

  const removeChar = (index: number) =>
    onUpdate({ characters: block.characters.filter((_, charIndex) => charIndex !== index) });

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="block text-[10px] font-bold uppercase text-slate-500">Characters</span>
        {block.characters.map((character, index) => (
          <div key={index} className="space-y-1 rounded border bg-slate-50 p-2">
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
              className="w-full rounded border p-1 text-xs font-bold"
              value={character.name}
              onChange={(e) => {
                const nextCharacters = [...block.characters];
                nextCharacters[index].name = e.target.value;
                onUpdate({ characters: nextCharacters });
              }}
              placeholder="Character Name"
            />
            <div className="flex gap-1">
              <input
                type="text"
                className="flex-1 rounded border p-1 text-xs"
                value={character.country || ''}
                onChange={(e) => {
                  const nextCharacters = [...block.characters];
                  nextCharacters[index].country = e.target.value;
                  onUpdate({ characters: nextCharacters });
                }}
                placeholder="Country"
              />
              <input
                type="text"
                className="flex-1 rounded border p-1 text-xs"
                value={character.city || ''}
                onChange={(e) => {
                  const nextCharacters = [...block.characters];
                  nextCharacters[index].city = e.target.value;
                  onUpdate({ characters: nextCharacters });
                }}
                placeholder="City"
              />
            </div>
            <input
              type="text"
              className="w-full rounded border p-1 text-xs"
              value={character.activity || ''}
              onChange={(e) => {
                const nextCharacters = [...block.characters];
                nextCharacters[index].activity = e.target.value;
                onUpdate({ characters: nextCharacters });
              }}
              placeholder="Activity"
            />
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
        <span className="block text-[10px] font-bold uppercase text-slate-500">Prompts</span>
        <textarea
          className="h-16 w-full rounded border p-2 text-sm"
          value={block.prompts.join('\n')}
          onChange={(e) =>
            onUpdate({
              prompts: e.target.value
                .split('\n')
                .map((prompt) => prompt.trim())
                .filter(Boolean)
            })
          }
          placeholder="Prompts (One per line)"
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
          className="space-y-1 rounded-xl border border-indigo-100 bg-white p-4 shadow-xs"
        >
          <p className="font-bold text-slate-900">{character.name}</p>
          {character.country && (
            <p className="text-xs text-slate-500">
              <strong className="text-indigo-400">Origin:</strong> {character.country}
            </p>
          )}
          {character.activity && (
            <p className="text-xs text-slate-500">
              <strong className="text-indigo-400">Activity:</strong> {character.activity}
            </p>
          )}
        </div>
      ))}
    </div>
    {block.prompts.length > 0 && (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <span className="mb-2 block text-[10px] font-bold uppercase text-slate-400">
          Prompts to use:
        </span>
        <ul className="space-y-1">
          {block.prompts.map((prompt, index) => (
            <li key={index} className="flex gap-2 font-serif text-sm text-slate-600">
              <span className="text-indigo-400">*</span>
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
