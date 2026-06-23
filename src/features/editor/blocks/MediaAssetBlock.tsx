import type { BlockFormProps, BlockPreviewProps, MediaBlock } from '../types/index';

export const MediaForm = ({ block, onUpdate }: BlockFormProps<MediaBlock>) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.url}
      onChange={(e) => onUpdate({ url: e.target.value })}
      placeholder="Media URL"
    />
    <input
      type="text"
      className="w-full p-2 border rounded text-sm"
      value={block.numbering || ''}
      onChange={(e) => onUpdate({ numbering: e.target.value })}
      placeholder="Caption / Numbering"
    />
  </div>
);

export const MediaPreview = ({ block }: BlockPreviewProps<MediaBlock>) => (
  <div
    className={`my-6 flex flex-col ${block.position === 'left' ? 'items-start' : block.position === 'right' ? 'items-end' : 'items-center'}`}
  >
    {block.numbering && (
      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
        {block.numbering}
      </span>
    )}
    <img
      src={block.url}
      alt=""
      className="rounded-xl border border-slate-200 max-h-64 object-cover shadow-sm bg-slate-50"
    />
  </div>
);
