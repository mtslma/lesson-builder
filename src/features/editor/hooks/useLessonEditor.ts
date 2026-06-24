import { useEffect, useMemo, useState } from 'react';
import type { Lesson, LessonBlock, BlockType, PublicLesson } from '../types/index';
import {
  createBlock,
  createEmptyLesson,
  createPublicLesson,
  duplicateBlock,
  nextPageNumber,
  normalizeLesson,
  syncPageBreaks
} from '../config/blockFactory';
import {
  formatImportIssue,
  lessonImportSchema,
  lessonSchema,
  publicLessonSchema
} from '../config/lessonSchema';

const STORAGE_KEY = 'english-platform-editor.lesson';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface HistoryState {
  past: Lesson[];
  present: Lesson;
  future: Lesson[];
}

const readStoredLesson = () => {
  if (typeof window === 'undefined') return createEmptyLesson();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createEmptyLesson();

    const parsed = JSON.parse(stored);
    return normalizeLesson(parsed) || createEmptyLesson();
  } catch {
    return createEmptyLesson();
  }
};

const persistLessonToStorage = (lesson: Lesson) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lesson));
};

const downloadLessonJson = (lesson: Lesson | PublicLesson, suffix?: string) => {
  const payload = JSON.stringify(lesson, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const slug = lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'lesson';
  anchor.download = `${slug}${suffix ? `-${suffix}` : ''}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useLessonEditor = () => {
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'json'>('preview');
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [jsonFeedback, setJsonFeedback] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState>(() => {
    const lesson = readStoredLesson();
    return { past: [], present: lesson, future: [] };
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const lesson = history.present;

  useEffect(() => {
    try {
      setSaveStatus('saving');
      persistLessonToStorage(lesson);
      setSaveStatus('saved');
      setLastSavedAt(Date.now());
      setIsDirty(false);
    } catch {
      setSaveStatus('error');
    }
  }, [lesson]);

  const saveLesson = () => {
    try {
      setSaveStatus('saving');
      persistLessonToStorage(lesson);
      setSaveStatus('saved');
      setLastSavedAt(Date.now());
      setIsDirty(false);
      setJsonFeedback('Lesson saved locally.');
      setImportError(null);
    } catch {
      setSaveStatus('error');
      setImportError('Unable to save lesson locally.');
      setJsonFeedback(null);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const commitLesson = (nextLesson: Lesson, options?: { markDirty?: boolean; resetHistory?: boolean }) => {
    setSaveStatus('unsaved');
    setHistory((prev) => {
      if (options?.resetHistory) {
        return { past: [], present: nextLesson, future: [] };
      }

      return {
        past: [...prev.past, prev.present],
        present: nextLesson,
        future: []
      };
    });

    setIsDirty(options?.markDirty ?? true);
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const nextPast = prev.past.slice(0, -1);

      return {
        past: nextPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
    setIsDirty(true);
  };

  const redo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const [nextPresent, ...nextFuture] = prev.future;

      return {
        past: [...prev.past, prev.present],
        present: nextPresent,
        future: nextFuture
      };
    });
    setIsDirty(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isUndo = event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'z';
      const isRedo =
        event.ctrlKey &&
        ((event.shiftKey && event.key.toLowerCase() === 'z') || event.key.toLowerCase() === 'y');

      if (isUndo) {
        event.preventDefault();
        undo();
      }

      if (isRedo) {
        event.preventDefault();
        redo();
      }

      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveLesson();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lesson]);

  const handleImport = () => {
    if (!window.confirm('Importing another lesson will replace the current one. Continue?')) {
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const validated = lessonImportSchema.safeParse(parsed);

      if (!validated.success) {
        const firstIssue = validated.error.issues[0];
        setImportError(firstIssue ? formatImportIssue(firstIssue) : 'Invalid lesson JSON.');
        setJsonFeedback(null);
        return;
      }

      const normalized = normalizeLesson(validated.data);
      if (!normalized) {
        setImportError('JSON must include a lesson object with a blocks array.');
        setJsonFeedback(null);
        return;
      }

      setImportError(null);
      setJsonFeedback('Lesson imported successfully.');
      setJsonInput(JSON.stringify(normalized, null, 2));
      commitLesson(normalized, { markDirty: false, resetHistory: true });
    } catch {
      setImportError('Invalid JSON syntax. Review the structure and try again.');
      setJsonFeedback(null);
    }
  };

  const addBlock = (type: BlockType, insertIndex?: number) => {
    const newBlock = createBlock(type, nextPageNumber(lesson.blocks));
    const newBlocks = [...lesson.blocks];
    if (insertIndex !== undefined) newBlocks.splice(insertIndex, 0, newBlock);
    else newBlocks.push(newBlock);
    commitLesson({ ...lesson, blocks: syncPageBreaks(newBlocks) });
  };

  const duplicateExistingBlock = (id: string) => {
    const blockIndex = lesson.blocks.findIndex((block) => block.id === id);
    if (blockIndex < 0) return;

    const duplicated = duplicateBlock(lesson.blocks[blockIndex]);
    const nextBlocks = [...lesson.blocks];
    nextBlocks.splice(blockIndex + 1, 0, duplicated);
    commitLesson({ ...lesson, blocks: syncPageBreaks(nextBlocks) });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...lesson.blocks];
    if (direction === 'up' && index > 0)
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    else if (direction === 'down' && index < newBlocks.length - 1)
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];

    commitLesson({ ...lesson, blocks: syncPageBreaks(newBlocks) });
  };

  const updateBlock = <T extends LessonBlock>(id: string, updatedFields: Partial<T>) => {
    commitLesson({
      ...lesson,
      blocks: lesson.blocks.map((block) =>
        block.id === id ? ({ ...block, ...updatedFields } as LessonBlock) : block
      )
    });
  };

  const removeBlock = (id: string) =>
    commitLesson({
      ...lesson,
      blocks: syncPageBreaks(lesson.blocks.filter((block) => block.id !== id))
    });

  const updateTitle = (title: string) => commitLesson({ ...lesson, title });

  const loadLessonIntoJson = () => {
    setJsonInput(JSON.stringify(lesson, null, 2));
    setImportError(null);
    setJsonFeedback('Current lesson loaded into the JSON editor.');
  };

  const formatJsonInput = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setImportError(null);
      setJsonFeedback('JSON formatted successfully.');
    } catch {
      setImportError('Invalid JSON syntax. Unable to format.');
      setJsonFeedback(null);
    }
  };

  const exportAuthoringJson = () => {
    const validated = lessonSchema.safeParse(lesson);
    if (!validated.success) {
      setImportError(formatImportIssue(validated.error.issues[0]));
      setJsonFeedback(null);
      return;
    }

    downloadLessonJson(validated.data, 'authoring');
    setJsonFeedback('Authoring JSON exported successfully.');
    setImportError(null);
    setIsDirty(false);
  };

  const publicLessonPreview = useMemo(() => createPublicLesson(lesson), [lesson]);

  const exportPublicJson = () => {
    const validated = publicLessonSchema.safeParse(publicLessonPreview);
    if (!validated.success) {
      setImportError(formatImportIssue(validated.error.issues[0]));
      setJsonFeedback(null);
      return;
    }

    downloadLessonJson(validated.data, 'public');
    setJsonFeedback('Public JSON exported successfully.');
    setImportError(null);
    setIsDirty(false);
  };

  const resetLesson = () => {
    if (!window.confirm('Create a new lesson and clear the current one?')) {
      return;
    }

    const emptyLesson = createEmptyLesson();
    setJsonInput(JSON.stringify(emptyLesson, null, 2));
    setImportError(null);
    setJsonFeedback('Blank lesson created.');
    commitLesson(emptyLesson, { markDirty: false, resetHistory: true });
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    lesson,
    publicLessonPreview,
    rightPanelMode,
    setRightPanelMode,
    jsonInput,
    setJsonInput,
    importError,
    jsonFeedback,
    isDirty,
    saveStatus,
    lastSavedAt,
    canUndo,
    canRedo,
    undo,
    redo,
    saveLesson,
    handleImport,
    loadLessonIntoJson,
    formatJsonInput,
    exportAuthoringJson,
    exportPublicJson,
    resetLesson,
    addBlock,
    duplicateExistingBlock,
    moveBlock,
    updateBlock,
    removeBlock,
    updateTitle
  };
};
