import { removeItemAt, updateItemAt } from '../domain/collections';
import type { BlockFormProps, BlockPreviewProps, RoleplayBlock } from '../types/index';
import type { ReactNode } from 'react';

const createCustomField = () => ({
  id: `roleplay-field-${Math.random().toString(36).slice(2, 9)}`,
  label: '',
  value: ''
});

const renderInlineBold = (text: string): ReactNode[] =>
  text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });

const renderRichText = (text: string, className: string) => (
  <div className={className}>
    {text.split('\n').map((line, index) => (
      <span key={index}>
        {index > 0 && <br />}
        {renderInlineBold(line)}
      </span>
    ))}
  </div>
);

export const RoleplayForm = ({ block, onUpdate }: BlockFormProps<RoleplayBlock>) => (
  <div className="space-y-3">
    <input
      type="text"
      className="w-full rounded border p-2 text-sm font-bold"
      value={block.title || ''}
      onChange={(e) => onUpdate({ title: e.target.value })}
      placeholder="Roleplay title"
    />
    <textarea
      className="min-h-[72px] w-full rounded border p-2 text-sm"
      value={block.objective}
      onChange={(e) => onUpdate({ objective: e.target.value })}
      placeholder="Objective"
    />

    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Custom fields
        </span>
        <button
          type="button"
          onClick={() => onUpdate({ customFields: [...(block.customFields || []), createCustomField()] })}
          className="text-xs font-bold text-blue-600"
        >
          + Add field
        </button>
      </div>

      {(block.customFields || []).length === 0 && (
        <p className="text-xs text-slate-400">Add only the fields you need for this roleplay card.</p>
      )}

      {(block.customFields || []).map((field, index) => (
        <div key={field.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
          <div className="grid gap-2 md:grid-cols-[180px_1fr_auto]">
            <input
              type="text"
              className="rounded border p-2 text-xs font-semibold"
              value={field.label}
              onChange={(e) =>
                onUpdate({
                  customFields: updateItemAt(block.customFields || [], index, (current) => ({
                    ...current,
                    label: e.target.value
                  }))
                })
              }
              placeholder="Field label"
            />
            <input
              type="text"
              className="rounded border p-2 text-xs"
              value={field.value}
              onChange={(e) =>
                onUpdate({
                  customFields: updateItemAt(block.customFields || [], index, (current) => ({
                    ...current,
                    value: e.target.value
                  }))
                })
              }
              placeholder="Short value"
            />
            <button
              type="button"
              onClick={() =>
                onUpdate({ customFields: removeItemAt(block.customFields || [], index) })
              }
              className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-500"
            >
              Remove
            </button>
          </div>
          <textarea
            className="min-h-[88px] w-full rounded border p-2 text-xs"
            value={field.value}
            onChange={(e) =>
              onUpdate({
                customFields: updateItemAt(block.customFields || [], index, (current) => ({
                  ...current,
                  value: e.target.value
                }))
              })
            }
            placeholder="Field content"
          />
        </div>
      ))}
    </div>
  </div>
);

export const RoleplayPreview = ({ block }: BlockPreviewProps<RoleplayBlock>) => (
  <div className="my-8 space-y-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-sm">
    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-indigo-500">
      Roleplay Card
    </span>
    {block.title && (
      <h3 className="text-xl font-semibold text-slate-900">{renderInlineBold(block.title)}</h3>
    )}

    <div className="rounded-xl border border-indigo-100 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-500">Objective</p>
      <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
        {renderRichText(block.objective, 'text-sm text-slate-700')}
      </div>
    </div>

    {(block.customFields || []).length > 0 && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(block.customFields || []).map((field) => (
          <div key={field.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {field.label ? renderInlineBold(field.label) : 'Field'}
            </p>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {renderRichText(field.value, 'text-sm text-slate-700')}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
