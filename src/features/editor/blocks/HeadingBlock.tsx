import type { BlockFormProps, BlockPreviewProps, HeadingBlock } from '../types/index';

const HEADING_LEVEL_OPTIONS = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' }
];

export const HeadingForm = ({ block, onUpdate }: BlockFormProps<HeadingBlock>) => (
  <div className="space-y-2">
    <select
      className="w-full p-2 border rounded text-sm"
      value={block.level || 'h2'}
      onChange={(e) => onUpdate({ level: e.target.value as HeadingBlock['level'] })}
    >
      {HEADING_LEVEL_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <input
      type="text"
      className="w-full text-lg font-bold border-b border-slate-200 outline-none pb-1 bg-transparent"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder="Heading text..."
    />
  </div>
);

const headingStyles: Record<string, string> = {
  h1: 'text-4xl font-black tracking-tight mt-10 mb-5 border-b-2 border-slate-200 pb-3',
  h2: 'text-2xl font-black tracking-tight mt-10 mb-4 border-b-2 border-slate-100 pb-2',
  h3: 'text-xl font-bold tracking-tight mt-8 mb-3',
  h4: 'text-base font-bold uppercase tracking-[0.14em] mt-6 mb-2 text-slate-600'
};

export const HeadingPreview = ({ block }: BlockPreviewProps<HeadingBlock>) => (
  <h2
    className={`font-serif text-slate-950 ${headingStyles[block.level || 'h2'] || headingStyles.h2}`}
  >
    {block.content}
  </h2>
);
