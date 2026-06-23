import React, { useRef, useState } from 'react';
import {
  Copy,
  ChevronLeft,
  ChevronRight,
  Eraser,
  FileCode2,
  FileDown,
  FolderUp,
  Plus,
  RotateCcw,
  ScissorsLineDashed,
  Wand2,
  X
} from 'lucide-react';
import type { PageBreakBlock } from './types/index';
import { useLessonEditor } from './hooks/useLessonEditor';
import { BlockWrapper } from './components/BlockWrapper';
import { StudentPreviewDispatcher } from './components/StudentPreviewDispatcher';
import { BLOCK_CATEGORIES } from './config/blockCatalog';
import { BLOCK_LABELS } from './config/blockMeta';

export const LessonEditor: React.FC = () => {
  const {
    lesson,
    rightPanelMode,
    setRightPanelMode,
    jsonInput,
    setJsonInput,
    importError,
    jsonFeedback,
    handleImport,
    loadLessonIntoJson,
    formatJsonInput,
    exportJson,
    resetLesson,
    addBlock,
    moveBlock,
    updateBlock,
    removeBlock,
    updateTitle
  } = useLessonEditor();
  const [currentPage, setCurrentPage] = useState(1);
  const [insertMenuIndex, setInsertMenuIndex] = useState<number | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [previewResetKey, setPreviewResetKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalPages = Math.max(1, lesson.blocks.filter((b) => b.type === 'page-break').length);

  const previewBlocks = (() => {
    const blocks: typeof lesson.blocks = [];
    let cPage = 1;
    lesson.blocks.forEach((b) => {
      if (b.type === 'page-break') cPage = (b as PageBreakBlock).pageNumber;
      else if (cPage === currentPage) blocks.push(b);
    });
    return blocks;
  })();

  const handleJsonFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    setJsonInput(content);
    event.target.value = '';
  };

  const handleCopyPreviewJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(lesson, null, 2));
    setJsonCopied(true);
    window.setTimeout(() => setJsonCopied(false), 1500);
  };

  const renderInlineInserter = (index: number) => {
    const isOpen = insertMenuIndex === index;
    const isListEmpty = lesson.blocks.length === 0;

    return (
      <div className="group relative z-20 flex justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div
            className={`w-full border-t transition-colors ${isOpen ? 'border-sky-300' : 'border-transparent group-hover:border-slate-200'}`}
          ></div>
        </div>
        {!isOpen ? (
          <button
            onClick={() => setInsertMenuIndex(index)}
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition-all hover:border-sky-400 hover:text-sky-700 ${isListEmpty ? 'border-sky-300 text-sky-700' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}
            title="Insert block here"
            type="button"
          >
            <Plus size={15} strokeWidth={2.4} />
          </button>
        ) : (
          <div className="relative z-50 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Insert Block
              </span>
              <button
                onClick={() => setInsertMenuIndex(null)}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 hover:bg-red-50"
                type="button"
              >
                <X size={12} strokeWidth={2.4} />
                Close
              </button>
            </div>
            <div className="custom-scrollbar max-h-[360px] space-y-5 overflow-y-auto pr-2">
              {BLOCK_CATEGORIES.map((cat) => (
                <div key={cat.title}>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {cat.title}
                  </span>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {cat.blocks.map((btn) => (
                      <button
                        key={btn.t}
                        onClick={() => {
                          addBlock(btn.t, index);
                          setInsertMenuIndex(null);
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
                        type="button"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-gradient-to-br ${btn.surface} ${btn.accent} shadow-sm`}
                        >
                          <btn.i size={17} strokeWidth={2.2} />
                        </span>
                        <span className="text-xs font-medium text-slate-700">{btn.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-800">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleJsonFileImport}
      />

      <div className="flex h-full w-1/2 flex-col border-r border-slate-300/80 bg-white/90 backdrop-blur-sm">
        <div className="shrink-0 border-b border-slate-200 px-6 py-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Lesson Editor
          </div>
          <input
            type="text"
            className="w-full border-none bg-transparent text-2xl font-semibold tracking-tight text-slate-900 outline-none"
            value={lesson.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Untitled lesson"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  JSON
                </div>
                <p className="mt-1 text-sm text-slate-600">Import, edit, validate and export.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={loadLessonIntoJson} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                  <FileCode2 size={14} strokeWidth={2.1} />
                  Load
                </button>
                <button type="button" onClick={formatJsonInput} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                  <Wand2 size={14} strokeWidth={2.1} />
                  Format
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                  <FolderUp size={14} strokeWidth={2.1} />
                  File
                </button>
                <button type="button" onClick={exportJson} className="inline-flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs text-white shadow-sm">
                  <FileDown size={14} strokeWidth={2.1} />
                  Export
                </button>
                <button type="button" onClick={resetLesson} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                  <RotateCcw size={14} strokeWidth={2.1} />
                  New
                </button>
              </div>
            </div>

            {(importError || jsonFeedback) && (
              <div className={`mb-3 rounded-xl border px-3 py-2 text-xs ${importError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                {importError || jsonFeedback}
              </div>
            )}

            <textarea
              className="min-h-[150px] w-full rounded-xl border border-slate-300 bg-slate-50/70 p-3 font-mono text-xs leading-6 text-slate-700 outline-none transition-colors focus:border-sky-400 focus:bg-white"
              placeholder="Paste lesson JSON here."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <button
              onClick={handleImport}
              className="mt-3 rounded-lg bg-sky-700 px-4 py-2 text-xs font-medium text-white shadow-sm"
              type="button"
            >
              Apply JSON
            </button>
          </div>

          <div className="pb-24">
            {lesson.blocks.length === 0 && renderInlineInserter(0)}
            {lesson.blocks.map((block, i) => (
              <React.Fragment key={block.id}>
                {renderInlineInserter(i)}
                {block.type === 'page-break' ? (
                  <div className="group relative flex items-center justify-center py-4">
                    <div className="absolute w-full border-t border-dashed border-slate-300"></div>
                    <span className="relative inline-flex items-center gap-2 rounded-full border border-slate-300 bg-gradient-to-r from-white to-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                      <ScissorsLineDashed size={12} strokeWidth={2.3} />
                      Page {block.pageNumber}
                    </span>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="absolute right-0 rounded bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 opacity-0 group-hover:opacity-100"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <BlockWrapper
                    block={block}
                    index={i}
                    isFirst={i === 0}
                    isLast={i === lesson.blocks.length - 1}
                    onUpdate={updateBlock}
                    onRemove={removeBlock}
                    onMove={moveBlock}
                  />
                )}
              </React.Fragment>
            ))}
            {lesson.blocks.length > 0 && renderInlineInserter(lesson.blocks.length)}
          </div>
        </div>
      </div>

      <div className="flex h-full w-1/2 flex-col bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-200">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Preview
            </div>
            <div className="mt-1 text-sm text-slate-300">Current student-facing view</div>
          </div>
          <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setRightPanelMode('preview')}
              className={`rounded-md px-4 py-1.5 text-xs ${rightPanelMode === 'preview' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              type="button"
            >
              Preview
            </button>
            <button
              onClick={() => setRightPanelMode('json')}
              className={`rounded-md px-4 py-1.5 text-xs ${rightPanelMode === 'json' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              type="button"
            >
              JSON
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {rightPanelMode === 'json' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_18px_48px_-24px_rgba(15,23,42,0.7)]">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Lesson JSON
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Structured export preview</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPreviewJson}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
                >
                  <Copy size={14} strokeWidth={2.1} />
                  {jsonCopied ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <pre className="overflow-x-auto bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] p-5 font-mono text-[11px] leading-6 text-emerald-300">
                {JSON.stringify(lesson, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-between rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 text-slate-800 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.4)]">
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                  <div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                      {lesson.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPreviewResetKey((value) => value + 1)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm hover:border-slate-400"
                      type="button"
                    >
                      <Eraser size={13} strokeWidth={2.1} />
                      Limpar respostas
                    </button>
                    <span className="text-xs text-slate-500">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>

                {previewBlocks.length === 0 ? (
                  <p className="py-16 text-center text-sm text-slate-400">
                    Add blocks to start building a lesson.
                  </p>
                ) : (
                  previewBlocks.map((b) => (
                    <div key={`${previewResetKey}-${b.id}`} className="relative">
                      <div className="mb-2 flex justify-end">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                          {BLOCK_LABELS[b.type]}
                        </span>
                      </div>
                      <StudentPreviewDispatcher block={b} />
                    </div>
                  ))
                )}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm disabled:opacity-35"
                  type="button"
                >
                  <ChevronLeft size={14} strokeWidth={2.3} />
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-md text-xs shadow-sm ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-500'}`}
                      type="button"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs text-white shadow-sm disabled:opacity-35"
                  type="button"
                >
                  Next
                  <ChevronRight size={14} strokeWidth={2.3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }`}</style>
    </div>
  );
};
