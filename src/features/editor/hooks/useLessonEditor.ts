import { useEffect, useMemo, useState } from 'react';
import type { Lesson, LessonBlock, BlockType, PublicLesson } from '../types/index';
import {
  createBlock,
  createEmptyLesson,
  createPublicLesson,
  duplicateBlock,
  nextPageNumber,
  normalizeLesson,
  prepareLessonForExport,
  syncPageBreaks
} from '../config/blockFactory';
import {
  formatImportIssue,
  formatImportIssues,
  lessonImportSchema,
  lessonSchema,
  publicLessonSchema
} from '../config/lessonSchema';

const STORAGE_KEY = 'english-platform-editor.lesson';
const STORAGE_BACKUP_KEY = 'english-platform-editor.lesson.backup';

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
    const backup = window.localStorage.getItem(STORAGE_BACKUP_KEY);

    const tryParseLesson = (value: string | null) => {
      if (!value) return null;

      try {
        return normalizeLesson(JSON.parse(value));
      } catch {
        return null;
      }
    };

    return tryParseLesson(stored) || tryParseLesson(backup) || createEmptyLesson();
  } catch {
    return createEmptyLesson();
  }
};

const persistLessonToStorage = (lesson: Lesson) => {
  if (typeof window === 'undefined') return;

  const normalizedLesson = normalizeLesson(prepareLessonForExport(lesson)) || lesson;
  const payload = JSON.stringify(normalizedLesson);

  window.localStorage.setItem(STORAGE_KEY, payload);
  window.localStorage.setItem(STORAGE_BACKUP_KEY, payload);
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

const unwrapLessonPayload = (payload: unknown): unknown => {
  if (!payload || typeof payload !== 'object') return payload;

  const candidate = payload as Record<string, unknown>;

  if ('documentType' in candidate && 'blocks' in candidate) {
    return candidate;
  }

  if ('lesson' in candidate) {
    return unwrapLessonPayload(candidate.lesson);
  }

  if ('contentJson' in candidate) {
    const content = candidate.contentJson;

    if (typeof content === 'string') {
      try {
        return unwrapLessonPayload(JSON.parse(content));
      } catch {
        return content;
      }
    }

    return unwrapLessonPayload(content);
  }

  if ('data' in candidate) {
    return unwrapLessonPayload(candidate.data);
  }

  return candidate;
};

const logLessonValidationFailure = (context: string, payload: unknown, issues?: string[]) => {
  console.group(`[lesson-editor] ${context}`);
  if (issues && issues.length > 0) {
    console.error('Issues:');
    issues.forEach((issue, index) => console.error(`${index + 1}. ${issue}`));
  }
  console.error('Payload:', payload);
  console.groupEnd();
};

export const useLessonEditor = () => {
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'json'>('preview');
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [jsonFeedback, setJsonFeedback] = useState<string | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<LessonBlock | null>(null);
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
      const unwrapped = unwrapLessonPayload(parsed);
      const normalized = normalizeLesson(unwrapped);
      if (!normalized) {
        const message =
          'JSON must include a lesson object with a blocks array. Check console for details.';
        setImportError(message);
        setJsonFeedback(null);
        logLessonValidationFailure('Import rejected before normalization', {
          parsed,
          unwrapped
        });
        return;
      }

      const validated = lessonImportSchema.safeParse(normalized);

      if (!validated.success) {
        const formattedIssues = formatImportIssues(validated.error.issues);
        const firstIssue = validated.error.issues[0];
        setImportError(
          firstIssue
            ? `${formatImportIssue(firstIssue)} (${validated.error.issues.length} issue(s) found. See console.)`
            : 'Invalid lesson JSON. See console for details.'
        );
        setJsonFeedback(null);
        logLessonValidationFailure('Import schema validation failed', normalized, formattedIssues);
        return;
      }

      setImportError(null);
      setJsonFeedback('Lesson imported successfully.');
      setJsonInput(JSON.stringify(validated.data, null, 2));
      commitLesson(validated.data as unknown as Lesson, { markDirty: false, resetHistory: true });
    } catch (error) {
      setImportError('Invalid JSON syntax. Review the structure and check console for details.');
      setJsonFeedback(null);
      console.group('[lesson-editor] JSON parse failed');
      console.error(error);
      console.error('Raw input:', jsonInput);
      console.groupEnd();
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

  const copyExistingBlock = (id: string) => {
    const blockToCopy = lesson.blocks.find((block) => block.id === id);
    if (!blockToCopy) return;

    setCopiedBlock(structuredClone(blockToCopy));
    setJsonFeedback('Block copied. Choose where to paste it.');
    setImportError(null);
  };

  const pasteCopiedBlock = (targetIndex: number, position: 'before' | 'after' = 'after') => {
    if (!copiedBlock) return;

    const safeIndex = Math.max(0, Math.min(targetIndex, lesson.blocks.length - 1));
    const insertIndex = position === 'before' ? safeIndex : safeIndex + 1;
    const nextBlocks = [...lesson.blocks];
    nextBlocks.splice(insertIndex, 0, duplicateBlock(copiedBlock));
    commitLesson({ ...lesson, blocks: syncPageBreaks(nextBlocks) });
    setJsonFeedback('Block pasted.');
    setImportError(null);
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
    const exportableLesson = prepareLessonForExport(lesson);
    const validated = lessonSchema.safeParse(exportableLesson);
    if (!validated.success) {
      setImportError(formatImportIssue(validated.error.issues[0]));
      setJsonFeedback(null);
      return;
    }

    downloadLessonJson(validated.data as unknown as Lesson, 'authoring');
    setJsonFeedback('Authoring JSON exported successfully.');
    setImportError(null);
    setIsDirty(false);
  };

  const publicLessonPreview = useMemo(
    () => createPublicLesson(prepareLessonForExport(lesson)),
    [lesson]
  );

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
    copyExistingBlock,
    copiedBlock,
    duplicateExistingBlock,
    moveBlock,
    pasteCopiedBlock,
    updateBlock,
    removeBlock,
    updateTitle
  };
};
