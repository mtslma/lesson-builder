import { Copy, Eraser } from 'lucide-react';
import { type RefObject } from 'react';
import { StudentPreviewDispatcher } from '../StudentPreviewDispatcher';
import { BLOCK_LABELS } from '../../config/blockMeta';
import type { Lesson } from '../../types';
import { PageControls } from './PageControls';

type PreviewPanelProps = {
  currentPage: number;
  jsonCopied: boolean;
  lesson: Lesson;
  previewBlocks: Lesson['blocks'];
  previewResetKey: number;
  previewScrollRef: RefObject<HTMLDivElement | null>;
  previewWidth: number;
  rightPanelMode: 'preview' | 'json';
  showBlockLabels: boolean;
  totalPages: number;
  onCopyPreviewJson: () => Promise<void> | void;
  onPageChange: (page: number) => void;
  onPreviewWidthChange: (value: number) => void;
  onResetPreview: () => void;
  onRightPanelModeChange: (mode: 'preview' | 'json') => void;
};

const StudentPageFooter = () => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/85 px-4 py-3 text-center">
    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
      End Of Page
    </div>
    <p className="mt-1.5 text-xs text-slate-600">
      Continue to the next page when you finish this part of the lesson.
    </p>
  </div>
);

export const PreviewPanel = ({
  currentPage,
  jsonCopied,
  lesson,
  previewBlocks,
  previewResetKey,
  previewScrollRef,
  previewWidth,
  rightPanelMode,
  showBlockLabels,
  totalPages,
  onCopyPreviewJson,
  onPageChange,
  onPreviewWidthChange,
  onResetPreview,
  onRightPanelModeChange
}: PreviewPanelProps) => (
  <div
    className="flex h-full flex-col bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-200"
    style={{ width: `${previewWidth}%` }}
  >
    <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Preview
        </div>
        <div className="mt-0.5 text-xs text-slate-300">Current student-facing view</div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">
          Width
          <input
            type="range"
            min={36}
            max={76}
            value={previewWidth}
            onChange={(event) => onPreviewWidthChange(Number(event.target.value))}
            className="w-20 accent-white"
          />
          <span className="w-8 text-right">{previewWidth}%</span>
        </label>

        <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => onRightPanelModeChange('preview')}
            className={`rounded-md px-3 py-1 text-[11px] ${
              rightPanelMode === 'preview' ? 'bg-white text-slate-900' : 'text-slate-400'
            }`}
            type="button"
          >
            Preview
          </button>
          <button
            onClick={() => onRightPanelModeChange('json')}
            className={`rounded-md px-3 py-1 text-[11px] ${
              rightPanelMode === 'json' ? 'bg-white text-slate-900' : 'text-slate-400'
            }`}
            type="button"
          >
            JSON
          </button>
        </div>
      </div>
    </div>

    <div ref={previewScrollRef} className="flex-1 overflow-y-auto p-4">
      {rightPanelMode === 'json' ? (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-[0_18px_48px_-24px_rgba(15,23,42,0.7)]">
          <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Lesson JSON
              </div>
              <div className="mt-1 text-xs text-slate-400">Structured export preview</div>
            </div>
            <button
              type="button"
              onClick={onCopyPreviewJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
            >
              <Copy size={14} strokeWidth={2.1} />
              {jsonCopied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="overflow-x-auto bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] p-4 font-mono text-[10px] leading-5 text-emerald-300">
            {JSON.stringify(lesson, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="mx-auto flex min-h-full w-full max-w-[920px] flex-col justify-between rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 text-slate-800 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.4)]">
          <div className="space-y-5">
            <div className="flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {lesson.title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={onResetPreview}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 shadow-sm hover:border-slate-400"
                  type="button"
                >
                  <Eraser size={13} strokeWidth={2.1} />
                  Limpar respostas
                </button>
                <span className="text-[11px] text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            <PageControls
              currentPage={currentPage}
              totalPages={totalPages}
              surface="dark"
              onPageChange={onPageChange}
            />

            {previewBlocks.length === 0 ? (
              <p className="py-12 text-center text-xs text-slate-400">
                Add blocks to start building a lesson.
              </p>
            ) : (
              previewBlocks.map((block) => (
                <div key={`${previewResetKey}-${block.id}`} className="relative">
                  {showBlockLabels && (
                    <div className="mb-2 flex justify-end">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                        {BLOCK_LABELS[block.type]}
                      </span>
                    </div>
                  )}
                  <StudentPreviewDispatcher block={block} />
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-3">
            {previewBlocks.length > 0 && <StudentPageFooter />}
            <PageControls
              currentPage={currentPage}
              totalPages={totalPages}
              surface="dark"
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);
