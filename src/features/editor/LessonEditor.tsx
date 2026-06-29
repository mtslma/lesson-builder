import React, { useMemo, useRef, useState } from 'react';
import type { PageBreakBlock } from './types';
import { useLessonEditor } from './hooks/useLessonEditor';
import { BLOCK_CATEGORIES } from './config/blockCatalog';
import { EditorSidebar } from './components/lessonEditor/EditorSidebar';
import { PreviewPanel } from './components/lessonEditor/PreviewPanel';

const CURRENT_PAGE_STORAGE_KEY = 'english-platform-editor.current-page';

const readStoredCurrentPage = () => {
  if (typeof window === 'undefined') return 1;

  const raw = window.localStorage.getItem(CURRENT_PAGE_STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export const LessonEditor: React.FC = () => {
  const {
    lesson,
    rightPanelMode,
    setRightPanelMode,
    jsonInput,
    setJsonInput,
    importError,
    jsonFeedback,
    saveStatus,
    lastSavedAt,
    handleImport,
    loadLessonIntoJson,
    formatJsonInput,
    exportAuthoringJson,
    exportPublicJson,
    resetLesson,
    addBlock,
    copyExistingBlock,
    copiedBlock,
    duplicateExistingBlock,
    moveBlock,
    pasteCopiedBlock,
    updateBlock,
    removeBlock,
    updateTitle,
    canUndo,
    canRedo,
    saveLesson,
    undo,
    redo
  } = useLessonEditor();

  const [currentPage, setCurrentPage] = useState(readStoredCurrentPage);
  const [insertMenuIndex, setInsertMenuIndex] = useState<number | null>(null);
  const [blockSearch, setBlockSearch] = useState('');
  const [jsonCopied, setJsonCopied] = useState(false);
  const [previewResetKey, setPreviewResetKey] = useState(0);
  const [showBlockLabels, setShowBlockLabels] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(50);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.max(1, lesson.blocks.filter((block) => block.type === 'page-break').length);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CURRENT_PAGE_STORAGE_KEY, String(currentPage));
  }, [currentPage]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageScopedData = useMemo(() => {
    const previewBlocks: typeof lesson.blocks = [];
    const editorEntries: Array<
      | { kind: 'block'; block: (typeof lesson.blocks)[number]; index: number }
      | { kind: 'page-break'; block: PageBreakBlock; index: number }
    > = [];

    let activePage = 1;
    let hasMatchingBreak = false;

    lesson.blocks.forEach((block, index) => {
      if (block.type === 'page-break') {
        activePage = (block as PageBreakBlock).pageNumber;
        if (activePage === currentPage) {
          hasMatchingBreak = true;
          editorEntries.push({ kind: 'page-break', block: block as PageBreakBlock, index });
        }
        return;
      }

      if (activePage === currentPage) {
        previewBlocks.push(block);
        editorEntries.push({ kind: 'block', block, index });
      }
    });

    return {
      editorEntries,
      previewBlocks,
      showInitialInserter: lesson.blocks.length === 0 || (currentPage === 1 && !hasMatchingBreak)
    };
  }, [currentPage, lesson]);

  const normalizedBlockSearch = blockSearch.trim().toLowerCase();
  const filteredBlockCategories = useMemo(() => {
    if (!normalizedBlockSearch) return BLOCK_CATEGORIES;

    return BLOCK_CATEGORIES.map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.l.toLowerCase().includes(normalizedBlockSearch) ||
          category.title.toLowerCase().includes(normalizedBlockSearch)
      )
    })).filter((category) => category.blocks.length > 0);
  }, [normalizedBlockSearch]);

  const saveStatusLabel =
    saveStatus === 'saving'
      ? 'Saving...'
      : saveStatus === 'saved'
        ? lastSavedAt
          ? `Saved ${new Date(lastSavedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}`
          : 'Saved'
        : saveStatus === 'error'
          ? 'Save failed'
          : 'Unsaved changes';

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

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      previewScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const closeInserter = () => {
    setBlockSearch('');
    setInsertMenuIndex(null);
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

      <EditorSidebar
        blockSearch={blockSearch}
        canRedo={canRedo}
        canUndo={canUndo}
        copiedBlock={copiedBlock}
        currentPage={currentPage}
        editorEntries={pageScopedData.editorEntries}
        fileInputRef={fileInputRef}
        filteredBlockCategories={filteredBlockCategories}
        importError={importError}
        insertMenuIndex={insertMenuIndex}
        jsonFeedback={jsonFeedback}
        jsonInput={jsonInput}
        lesson={lesson}
        previewWidth={previewWidth}
        saveStatus={saveStatus}
        saveStatusLabel={saveStatusLabel}
        showBlockLabels={showBlockLabels}
        showInitialInserter={pageScopedData.showInitialInserter}
        totalPages={totalPages}
        onAddBlock={addBlock}
        onApplyJson={handleImport}
        onBlockSearchChange={setBlockSearch}
        onCloseInserter={closeInserter}
        onCopyBlock={copyExistingBlock}
        onDuplicateBlock={duplicateExistingBlock}
        onExportAuthoringJson={exportAuthoringJson}
        onExportPublicJson={exportPublicJson}
        onFormatJson={formatJsonInput}
        onJsonInputChange={setJsonInput}
        onLoadLessonIntoJson={loadLessonIntoJson}
        onMoveBlock={moveBlock}
        onOpenInserter={setInsertMenuIndex}
        onPageChange={goToPage}
        onPasteBlock={pasteCopiedBlock}
        onRedo={redo}
        onRemoveBlock={removeBlock}
        onResetLesson={resetLesson}
        onSaveLesson={saveLesson}
        onTitleChange={updateTitle}
        onToggleBlockLabels={() => setShowBlockLabels((value) => !value)}
        onUndo={undo}
        onUpdateBlock={updateBlock}
      />

      <PreviewPanel
        currentPage={currentPage}
        jsonCopied={jsonCopied}
        lesson={lesson}
        previewBlocks={pageScopedData.previewBlocks}
        previewResetKey={previewResetKey}
        previewScrollRef={previewScrollRef}
        previewWidth={previewWidth}
        rightPanelMode={rightPanelMode}
        showBlockLabels={showBlockLabels}
        totalPages={totalPages}
        onCopyPreviewJson={handleCopyPreviewJson}
        onPageChange={goToPage}
        onPreviewWidthChange={setPreviewWidth}
        onResetPreview={() => setPreviewResetKey((value) => value + 1)}
        onRightPanelModeChange={setRightPanelMode}
      />

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }`}</style>
    </div>
  );
};
