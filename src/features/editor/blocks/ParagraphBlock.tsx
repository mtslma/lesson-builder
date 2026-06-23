import type { BlockFormProps, BlockPreviewProps, ParagraphBlock } from '../types/index';

const PARAGRAPH_STYLE_OPTIONS = [
  { label: 'Body', value: 'body' },
  { label: 'Intro', value: 'intro' },
  { label: 'Instruction', value: 'instruction' },
  { label: 'Note', value: 'note' }
];

export const ParagraphForm = ({ block, onUpdate }: BlockFormProps<ParagraphBlock>) => (
  <div className="space-y-2">
    <select
      className="w-full p-2 border rounded text-sm"
      value={block.style || 'body'}
      onChange={(e) => onUpdate({ style: e.target.value as ParagraphBlock['style'] })}
    >
      {PARAGRAPH_STYLE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <textarea
      className="w-full p-2 border border-slate-200 rounded text-sm min-h-[80px]"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder="Paragraph text..."
    />
  </div>
);

const paragraphStyles: Record<string, string> = {
  body: 'text-base text-slate-700 leading-relaxed font-serif my-4',
  intro: 'text-lg text-slate-800 leading-8 font-serif my-5',
  instruction: 'text-sm text-sky-900 leading-7 font-medium bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 my-4',
  note: 'text-sm text-slate-600 leading-7 italic border-l-4 border-slate-300 pl-4 my-4'
};

export const ParagraphPreview = ({ block }: BlockPreviewProps<ParagraphBlock>) => (
  <p className={paragraphStyles[block.style || 'body'] || paragraphStyles.body}>{block.content}</p>
);
