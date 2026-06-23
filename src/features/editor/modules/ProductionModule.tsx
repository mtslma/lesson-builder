import React from 'react';

export const TeacherNoteForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Note title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-24"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder="Tip or guidance for the student"
    />
  </div>
);

export const ConversationForm: React.FC<any> = ({ block, onUpdate }) => {
  const addMsg = () =>
    onUpdate({ messages: [...block.messages, { speaker: '', text: '', highlighted: false }] });
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm mb-2"
        value={block.imageUrl || ''}
        onChange={(e) => onUpdate({ imageUrl: e.target.value })}
        placeholder="Context Image URL"
      />
      {block.messages.map((m: any, i: number) => (
        <div key={i} className="flex gap-2 items-center bg-slate-50 border p-1 rounded">
          <input
            type="text"
            className="w-1/4 p-1.5 border rounded text-xs font-bold"
            value={m.speaker}
            onChange={(e) => {
              const n = [...block.messages];
              n[i].speaker = e.target.value;
              onUpdate({ messages: n });
            }}
            placeholder="Speaker"
          />
          <input
            type="text"
            className="flex-1 p-1.5 border rounded text-xs"
            value={m.text}
            onChange={(e) => {
              const n = [...block.messages];
              n[i].text = e.target.value;
              onUpdate({ messages: n });
            }}
            placeholder="Dialogue"
          />
          <label className="flex items-center gap-1 text-[10px]">
            <input
              type="checkbox"
              checked={!!m.highlighted}
              onChange={(e) => {
                const n = [...block.messages];
                n[i].highlighted = e.target.checked;
                onUpdate({ messages: n });
              }}
            />{' '}
            Highlight
          </label>
        </div>
      ))}
      <button type="button" onClick={addMsg} className="text-xs text-blue-600 font-bold">
        + Add Line
      </button>
    </div>
  );
};

export const ConversationPromptsForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-24"
      value={block.prompts.join('\n')}
      onChange={(e) => onUpdate({ prompts: e.target.value.split('\n').filter(Boolean) })}
      placeholder="Prompts (One per line)"
    />
  </div>
);

export const RoleplayForm: React.FC<any> = ({ block, onUpdate }) => {
  const addChar = () => onUpdate({ characters: [...(block.characters || []), { name: '' }] });
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase block text-slate-500">Characters</span>
        {(block.characters || []).map((c: any, i: number) => (
          <div key={i} className="border p-2 rounded bg-slate-50 space-y-1">
            <input
              type="text"
              className="w-full p-1 text-xs border rounded font-bold"
              value={c.name}
              onChange={(e) => {
                const n = [...block.characters];
                n[i].name = e.target.value;
                onUpdate({ characters: n });
              }}
              placeholder="Character Name"
            />
            <div className="flex gap-1">
              <input
                type="text"
                className="flex-1 p-1 text-xs border rounded"
                value={c.country || ''}
                onChange={(e) => {
                  const n = [...block.characters];
                  n[i].country = e.target.value;
                  onUpdate({ characters: n });
                }}
                placeholder="Country"
              />
              <input
                type="text"
                className="flex-1 p-1 text-xs border rounded"
                value={c.city || ''}
                onChange={(e) => {
                  const n = [...block.characters];
                  n[i].city = e.target.value;
                  onUpdate({ characters: n });
                }}
                placeholder="City"
              />
            </div>
            <input
              type="text"
              className="w-full p-1 text-xs border rounded"
              value={c.activity || ''}
              onChange={(e) => {
                const n = [...block.characters];
                n[i].activity = e.target.value;
                onUpdate({ characters: n });
              }}
              placeholder="Activity"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addChar}
          className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold"
        >
          + Add Character
        </button>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase block text-slate-500">Prompts</span>
        <textarea
          className="w-full p-2 border rounded text-sm h-16"
          value={(block.prompts || []).join('\n')}
          onChange={(e) => onUpdate({ prompts: e.target.value.split('\n').filter(Boolean) })}
          placeholder="Prompts (One per line)"
        />
      </div>
    </div>
  );
};

export const WritingTaskForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-16"
      value={block.prompt}
      onChange={(e) => onUpdate({ prompt: e.target.value })}
      placeholder="Writing Prompt"
    />
    <input
      type="number"
      className="w-24 p-2 border rounded text-sm"
      value={block.minWords || ''}
      onChange={(e) => onUpdate({ minWords: Number(e.target.value) })}
      placeholder="Min Words"
    />
  </div>
);

export const FinalTaskForm: React.FC<any> = ({ block, onUpdate }) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Title"
    />
    <textarea
      className="w-full p-2 border rounded text-sm h-16"
      value={(block.fields || []).join('\n')}
      onChange={(e) =>
        onUpdate({
          fields: e.target.value
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean)
        })
      }
      placeholder="Fields (One per line)"
    />
  </div>
);

export const ConversationPreview: React.FC<any> = ({ block }) => (
  <div className="space-y-4 bg-slate-50/80 p-6 rounded-2xl border border-slate-200 my-6 shadow-sm">
    {block.imageUrl && (
      <img
        src={block.imageUrl}
        className="w-full h-32 object-cover rounded-lg border border-slate-200"
        alt="Context"
      />
    )}
    {block.messages.map((m: any, i: number) => (
      <div key={i} className="flex gap-4 text-sm font-sans">
        <span className="font-extrabold text-slate-900 min-w-[60px] uppercase text-xs tracking-wide">
          {m.speaker}:
        </span>
        <p className="text-slate-800">
          {m.highlighted ? (
            <span className="bg-lime-200 px-1 py-0.5 rounded font-bold border-b border-lime-400">
              {m.text}
            </span>
          ) : (
            m.text
          )}
        </p>
      </div>
    ))}
    {block.substitutionBox && block.substitutionBox.length > 0 && (
      <div className="mt-4 pt-4 border-t border-dashed border-slate-300 space-y-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase">🔄 Alternatives:</span>
        {block.substitutionBox.map((sub: any, sIdx: number) => (
          <div
            key={sIdx}
            className="text-xs bg-white border p-2.5 rounded-lg text-slate-600 font-medium"
          >
            <strong className="text-slate-900">{sub.original}</strong> &rarr;{' '}
            {sub.alternatives.join(' / ')}
          </div>
        ))}
      </div>
    )}
  </div>
);

export const ConversationPromptsPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 p-6 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-sm">
    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest font-mono block mb-4">
      💬 Discussion Time: {block.title}
    </span>
    <div className="space-y-3">
      {block.prompts.map((p: string, i: number) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs flex items-start gap-3"
        >
          <span className="text-amber-500 font-black text-lg leading-none">Q.</span>
          <p className="text-base font-serif font-bold text-slate-800 leading-relaxed">{p}</p>
        </div>
      ))}
    </div>
  </div>
);

export const RoleplayPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 p-6 bg-indigo-50/50 border border-indigo-200 rounded-2xl shadow-sm space-y-5">
    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-mono block mb-2">
      🎭 Roleplay Cards
    </span>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {block.characters.map((c: any, i: number) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs space-y-1"
        >
          <p className="font-bold text-slate-900">{c.name}</p>
          {c.country && (
            <p className="text-xs text-slate-500">
              <strong className="text-indigo-400">Origin:</strong> {c.country}
            </p>
          )}
          {c.activity && (
            <p className="text-xs text-slate-500">
              <strong className="text-indigo-400">Activity:</strong> {c.activity}
            </p>
          )}
        </div>
      ))}
    </div>
    {block.prompts && block.prompts.length > 0 && (
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">
          Prompts to use:
        </span>
        <ul className="space-y-1">
          {block.prompts.map((pr: string, i: number) => (
            <li key={i} className="text-sm text-slate-600 font-serif flex gap-2">
              <span className="text-indigo-400">•</span>
              {pr}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export const WritingTaskPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 p-6 border-2 border-slate-900 bg-white rounded-2xl shadow-md space-y-4">
    <div className="border-b-2 border-slate-100 pb-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-1">
        Writing Assignment
      </span>
      <h3 className="text-lg font-bold font-serif text-slate-900">{block.title}</h3>
    </div>
    <p className="text-sm text-slate-600 font-serif italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
      {block.prompt}
    </p>
    <div className="relative">
      <textarea
        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:bg-white focus:border-slate-400 transition-colors font-sans text-sm text-slate-800"
        placeholder="Start writing here..."
      ></textarea>
      {block.minWords && (
        <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-slate-400">
          Min words: {block.minWords}
        </span>
      )}
    </div>
  </div>
);

export const FinalTaskPreview: React.FC<any> = ({ block }) => (
  <div className="my-8 p-6 border-t-4 border-slate-900 bg-white shadow-lg space-y-5 rounded-b-2xl">
    <h3 className="text-xl font-bold font-serif text-slate-900 text-center">{block.title}</h3>
    <div className="space-y-3">
      {block.fields.map((f: string, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 w-1/3 md:w-1/4 text-right">{f}:</span>
          <input
            type="text"
            className="flex-1 border-b-2 border-slate-200 bg-transparent outline-none focus:border-lime-500 py-1 text-sm font-sans"
            placeholder="..."
          />
        </div>
      ))}
    </div>
  </div>
);

export const TeacherNotePreview: React.FC<any> = ({ block }) => (
  <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
      Student Tip
    </div>
    <h3 className="mt-2 text-base font-semibold text-amber-950">{block.title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-700">{block.content}</p>
  </div>
);
