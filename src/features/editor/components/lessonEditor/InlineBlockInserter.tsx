import { Plus, X } from 'lucide-react';
import { BLOCK_CATEGORIES } from '../../config/blockCatalog';
import type { BlockType } from '../../types';

type InlineBlockInserterProps = {
  blockSearch: string;
  filteredBlockCategories: typeof BLOCK_CATEGORIES;
  index: number;
  insertMenuIndex: number | null;
  isListEmpty: boolean;
  onAddBlock: (type: BlockType, index: number) => void;
  onBlockSearchChange: (value: string) => void;
  onClose: () => void;
  onOpen: (index: number) => void;
};

export const InlineBlockInserter = ({
  blockSearch,
  filteredBlockCategories,
  index,
  insertMenuIndex,
  isListEmpty,
  onAddBlock,
  onBlockSearchChange,
  onClose,
  onOpen
}: InlineBlockInserterProps) => {
  const isOpen = insertMenuIndex === index;

  return (
    <div className="group relative z-20 flex justify-center py-2">
      <div className="absolute inset-0 flex items-center">
        <div
          className={`w-full border-t transition-colors ${
            isOpen ? 'border-sky-300' : 'border-transparent group-hover:border-slate-200'
          }`}
        ></div>
      </div>

      {!isOpen ? (
        <button
          onClick={() => onOpen(index)}
          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition-all hover:border-sky-400 hover:text-sky-700 ${
            isListEmpty
              ? 'border-sky-300 text-sky-700'
              : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
          title="Insert block here"
          type="button"
        >
          <Plus size={15} strokeWidth={2.4} />
        </button>
      ) : (
        <div className="relative z-50 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-3 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Insert Block
            </span>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 hover:bg-red-50"
              type="button"
            >
              <X size={12} strokeWidth={2.4} />
              Close
            </button>
          </div>

          <input
            type="text"
            value={blockSearch}
            onChange={(event) => onBlockSearchChange(event.target.value)}
            placeholder="Search blocks..."
            className="mb-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-colors focus:border-sky-400 focus:bg-white"
          />

          <div className="custom-scrollbar max-h-[320px] space-y-4 overflow-y-auto pr-1">
            {filteredBlockCategories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No blocks found.
              </div>
            ) : (
              filteredBlockCategories.map((category) => (
                <div key={category.title}>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {category.title}
                  </span>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {category.blocks.map((block) => (
                      <button
                        key={block.t}
                        onClick={() => {
                          onAddBlock(block.t, index);
                          onBlockSearchChange('');
                          onClose();
                        }}
                        className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2 text-left transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                        type="button"
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/70 bg-gradient-to-br ${block.surface} ${block.accent} shadow-sm`}
                        >
                          <block.i size={17} strokeWidth={2.2} />
                        </span>
                        <span className="text-[11px] font-medium text-slate-700">{block.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
