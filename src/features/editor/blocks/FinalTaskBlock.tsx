import type { BlockFormProps, BlockPreviewProps, FinalTaskBlock } from '../types/index';

export const FinalTaskForm = ({ block, onUpdate }: BlockFormProps<FinalTaskBlock>) => (
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

export const FinalTaskPreview = ({ block }: BlockPreviewProps<FinalTaskBlock>) => (
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
