import {
  FileCode2,
  FileDown,
  FolderUp,
  Redo2,
  RotateCcw,
  ScissorsLineDashed,
  Tags,
  Undo2,
  Wand2
} from 'lucide-react';
import React, { type RefObject } from 'react';
import { BlockWrapper } from '../BlockWrapper';
import { PageControls } from './PageControls';
import { InlineBlockInserter } from './InlineBlockInserter';
import type { BlockType, Lesson, LessonBlock, PageBreakBlock } from '../../types';

type EditorEntry =
  | { kind: 'block'; block: Lesson['blocks'][number]; index: number }
  | { kind: 'page-break'; block: PageBreakBlock; index: number };

type EditorSidebarProps = {
  blockSearch: string;
  canRedo: boolean;
  canUndo: boolean;
  copiedBlock: Lesson['blocks'][number] | null;
  currentPage: number;
  editorEntries: EditorEntry[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  filteredBlockCategories: any[];
  importError: string | null;
  insertMenuIndex: number | null;
  jsonFeedback: string | null;
  jsonInput: string;
  lesson: Lesson;
  previewWidth: number;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  saveStatusLabel: string;
  showBlockLabels: boolean;
  showInitialInserter: boolean;
  totalPages: number;
  onAddBlock: (type: BlockType, index?: number) => void;
  onApplyJson: () => void;
  onBlockSearchChange: (value: string) => void;
  onCloseInserter: () => void;
  onCopyBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onExportAuthoringJson: () => void;
  onExportPublicJson: () => void;
  onFormatJson: () => void;
  onJsonInputChange: (value: string) => void;
  onLoadLessonIntoJson: () => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onOpenInserter: (index: number) => void;
  onPageChange: (page: number) => void;
  onPasteBlock: (index: number, position?: 'before' | 'after') => void;
  onRedo: () => void;
  onRemoveBlock: (blockId: string) => void;
  onResetLesson: () => void;
  onSaveLesson: () => void;
  onTitleChange: (value: string) => void;
  onToggleBlockLabels: () => void;
  onUndo: () => void;
  onUpdateBlock: (id: string, fields: Partial<LessonBlock>) => void;
};

export const EditorSidebar = ({
  blockSearch,
  canRedo,
  canUndo,
  copiedBlock,
  currentPage,
  editorEntries,
  fileInputRef,
  filteredBlockCategories,
  importError,
  insertMenuIndex,
  jsonFeedback,
  jsonInput,
  lesson,
  previewWidth,
  saveStatus,
  saveStatusLabel,
  showBlockLabels,
  showInitialInserter,
  totalPages,
  onAddBlock,
  onApplyJson,
  onBlockSearchChange,
  onCloseInserter,
  onCopyBlock,
  onDuplicateBlock,
  onExportAuthoringJson,
  onExportPublicJson,
  onFormatJson,
  onJsonInputChange,
  onLoadLessonIntoJson,
  onMoveBlock,
  onOpenInserter,
  onPageChange,
  onPasteBlock,
  onRedo,
  onRemoveBlock,
  onResetLesson,
  onSaveLesson,
  onTitleChange,
  onToggleBlockLabels,
  onUndo,
  onUpdateBlock
}: EditorSidebarProps) => (
  <div
    className="flex h-full flex-col border-r border-slate-300/80 bg-white/90 backdrop-blur-sm"
    style={{ width: `${100 - previewWidth}%` }}
  >
    <div className="shrink-0 border-b border-slate-200 px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Lesson Editor
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleBlockLabels}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] shadow-sm ${
              showBlockLabels
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            <Tags size={13} strokeWidth={2.1} />
            {showBlockLabels ? 'Ocultar tipos' : 'Mostrar tipos'}
          </button>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              saveStatus === 'saved'
                ? 'bg-emerald-50 text-emerald-700'
                : saveStatus === 'saving'
                  ? 'bg-amber-50 text-amber-700'
                  : saveStatus === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-slate-100 text-slate-600'
            }`}
          >
            {saveStatusLabel}
          </span>
          <button
            type="button"
            onClick={onSaveLesson}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm"
          >
            Save
          </button>
        </div>
      </div>

      <input
        type="text"
        className="w-full border-none bg-transparent text-xl font-semibold tracking-tight text-slate-900 outline-none"
        value={lesson.title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="Untitled lesson"
      />
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mb-4">
        <PageControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              JSON
            </div>
            <p className="mt-0.5 text-xs text-slate-600">Import, edit, validate and export.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm disabled:opacity-40"
            >
              <Undo2 size={14} strokeWidth={2.1} />
              Undo
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm disabled:opacity-40"
            >
              <Redo2 size={14} strokeWidth={2.1} />
              Redo
            </button>
            <button
              type="button"
              onClick={onLoadLessonIntoJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm"
            >
              <FileCode2 size={14} strokeWidth={2.1} />
              Load
            </button>
            <button
              type="button"
              onClick={onFormatJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm"
            >
              <Wand2 size={14} strokeWidth={2.1} />
              Format
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm"
            >
              <FolderUp size={14} strokeWidth={2.1} />
              File
            </button>
            <button
              type="button"
              onClick={onExportAuthoringJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-900 bg-slate-900 px-2.5 py-1.5 text-[11px] text-white shadow-sm"
            >
              <FileDown size={14} strokeWidth={2.1} />
              Authoring
            </button>
            <button
              type="button"
              onClick={onExportPublicJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm"
            >
              <FileDown size={14} strokeWidth={2.1} />
              Public
            </button>
            <button
              type="button"
              onClick={onResetLesson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-sm"
            >
              <RotateCcw size={14} strokeWidth={2.1} />
              New
            </button>
          </div>
        </div>

        {(importError || jsonFeedback) && (
          <div
            className={`mb-3 rounded-lg border px-3 py-2 text-[11px] ${
              importError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {importError || jsonFeedback}
          </div>
        )}

        <textarea
          className="min-h-[120px] w-full rounded-lg border border-slate-300 bg-slate-50/70 p-3 font-mono text-[11px] leading-5 text-slate-700 outline-none transition-colors focus:border-sky-400 focus:bg-white"
          placeholder="Paste lesson JSON here."
          value={jsonInput}
          onChange={(event) => onJsonInputChange(event.target.value)}
        />
        <button
          onClick={onApplyJson}
          className="mt-2.5 rounded-md bg-sky-700 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm"
          type="button"
        >
          Apply JSON
        </button>
      </div>

      <div className="pb-24">
        {showInitialInserter && (
          <InlineBlockInserter
            index={0}
            blockSearch={blockSearch}
            filteredBlockCategories={filteredBlockCategories}
            insertMenuIndex={insertMenuIndex}
            isListEmpty={lesson.blocks.length === 0}
            onAddBlock={onAddBlock}
            onBlockSearchChange={onBlockSearchChange}
            onClose={onCloseInserter}
            onOpen={onOpenInserter}
          />
        )}

        {editorEntries.map((entry) => (
          <React.Fragment key={entry.kind === 'block' ? entry.block.id : `page-break-${entry.block.id}`}>
            <InlineBlockInserter
              index={entry.index}
              blockSearch={blockSearch}
              filteredBlockCategories={filteredBlockCategories}
              insertMenuIndex={insertMenuIndex}
              isListEmpty={lesson.blocks.length === 0}
              onAddBlock={onAddBlock}
              onBlockSearchChange={onBlockSearchChange}
              onClose={onCloseInserter}
              onOpen={onOpenInserter}
            />

            {entry.kind === 'page-break' ? (
              <div className="relative rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.25)]">
                <div className="absolute inset-x-4 top-1/2 -z-10 border-t border-dashed border-slate-300"></div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="relative inline-flex items-center gap-2 rounded-full border border-slate-300 bg-gradient-to-r from-white to-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                    <ScissorsLineDashed size={12} strokeWidth={2.3} />
                    Page {entry.block.pageNumber}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onCopyBlock(entry.block.id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm"
                      type="button"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => onPasteBlock(entry.index, 'after')}
                      disabled={!copiedBlock}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm disabled:opacity-30"
                      type="button"
                    >
                      Paste
                    </button>
                    <button
                      onClick={() => onDuplicateBlock(entry.block.id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm"
                      type="button"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => onRemoveBlock(entry.block.id)}
                      className="rounded-lg border border-red-100 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-600 shadow-sm"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <BlockWrapper
                block={entry.block}
                index={entry.index}
                isFirst={entry.index === 0}
                isLast={entry.index === lesson.blocks.length - 1}
                onUpdate={onUpdateBlock}
                onRemove={onRemoveBlock}
                onCopy={onCopyBlock}
                onDuplicate={onDuplicateBlock}
                onMove={onMoveBlock}
                onPaste={onPasteBlock}
                canPaste={Boolean(copiedBlock)}
              />
            )}
          </React.Fragment>
        ))}

        {lesson.blocks.length > 0 && (
          <InlineBlockInserter
            index={
              editorEntries.at(-1)?.index !== undefined
                ? editorEntries.at(-1)!.index + 1
                : lesson.blocks.length
            }
            blockSearch={blockSearch}
            filteredBlockCategories={filteredBlockCategories}
            insertMenuIndex={insertMenuIndex}
            isListEmpty={lesson.blocks.length === 0}
            onAddBlock={onAddBlock}
            onBlockSearchChange={onBlockSearchChange}
            onClose={onCloseInserter}
            onOpen={onOpenInserter}
          />
        )}
      </div>

      <div className="mt-5">
        <PageControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  </div>
);
