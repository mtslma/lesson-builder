import type { ReactNode } from 'react';
import type { BlockFormProps, BlockPreviewProps, ExampleBoxesBlock } from '../types/index';

const renderParagraphs = (content: string, className: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className={className}>
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInlineBold(line)}
          </span>
        ))}
      </p>
    ));

const renderInlineBold = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });
};

const renderContentWithBold = (content: string, className: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className={className}>
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInlineBold(line)}
          </span>
        ))}
      </p>
    ));

export const ExampleBoxesForm = ({ block, onUpdate }: BlockFormProps<ExampleBoxesBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full rounded border p-2 text-sm font-bold"
      value={block.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Block title"
    />
    <textarea
      className="min-h-[96px] w-full rounded border p-2 text-sm"
      value={block.explanation}
      onChange={(e) => onUpdate({ explanation: e.target.value })}
      placeholder="Explanation"
    />

    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <input
          type="text"
          className="w-full rounded border p-2 text-sm font-semibold"
          value={block.leftTitle}
          onChange={(e) => onUpdate({ leftTitle: e.target.value })}
          placeholder="Left box title"
        />
        <textarea
          className="min-h-[180px] w-full rounded border p-2 text-sm"
          value={block.leftContent}
          onChange={(e) => onUpdate({ leftContent: e.target.value })}
          placeholder="Left box content"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <input
          type="text"
          className="w-full rounded border p-2 text-sm font-semibold"
          value={block.rightTitle}
          onChange={(e) => onUpdate({ rightTitle: e.target.value })}
          placeholder="Right box title"
        />
        <textarea
          className="min-h-[180px] w-full rounded border p-2 text-sm"
          value={block.rightContent}
          onChange={(e) => onUpdate({ rightContent: e.target.value })}
          placeholder="Right box content"
        />
      </div>
    </div>
  </div>
);

export const ExampleBoxesPreview = ({ block }: BlockPreviewProps<ExampleBoxesBlock>) => (
  <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-4 py-3">
      <h3 className="text-start text-base font-semibold text-slate-900">{block.title}</h3>
    </div>

    <div className="space-y-4 px-4 py-4">
      <div className="mx-auto max-w-3xl space-y-2 text-start">
        {renderParagraphs(block.explanation, 'text-sm leading-5 text-slate-700')}
      </div>

      <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2 ">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.08em] text-slate-700">
            {block.leftTitle || 'Example'}
          </div>
          <div className="space-y-2 px-4 py-3">
            {renderContentWithBold(block.leftContent, 'text-sm leading-5 text-slate-700')}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.08em] text-slate-700">
            {block.rightTitle || 'Example'}
          </div>
          <div className="space-y-2 px-4 py-3">
            {renderContentWithBold(block.rightContent, 'text-sm leading-5 text-slate-700')}
          </div>
        </div>
      </div>
    </div>
  </div>
);
