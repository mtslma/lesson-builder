import type { ReactNode } from 'react';
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
      className="w-full p-2 border border-slate-200 rounded text-sm min-h-[120px]"
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder={'Paragraph text...\nUse a blank line for a new paragraph.\nUse **bold** for emphasis.'}
    />
  </div>
);

const paragraphStyles: Record<string, string> = {
  body: 'text-base text-slate-700 leading-relaxed font-serif my-4',
  intro: 'text-lg text-slate-800 leading-8 font-serif my-5',
  instruction: 'text-sm text-sky-900 leading-7 font-medium bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 my-4',
  note: 'text-sm text-slate-600 leading-7 italic border-l-4 border-slate-300 pl-4 my-4'
};

const renderInlineFormatting = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
};

const renderParagraphContent = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => {
      const lines = paragraph.split('\n');

      return (
        <p key={index}>
          {lines.map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 ? <br /> : null}
              {renderInlineFormatting(line)}
            </span>
          ))}
        </p>
      );
    });

export const ParagraphPreview = ({ block }: BlockPreviewProps<ParagraphBlock>) => (
  <div className={paragraphStyles[block.style || 'body'] || paragraphStyles.body}>
    {renderParagraphContent(block.content)}
  </div>
);
