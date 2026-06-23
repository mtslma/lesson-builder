import { useEffect, useState } from 'react';
import type { LessonBlock, BlockType } from '../types/index';
import {
  createBlock,
  createEmptyLesson,
  nextPageNumber,
  normalizeLesson,
  syncPageBreaks
} from '../config/blockFactory';
import { formatImportIssue, lessonImportSchema } from '../config/lessonSchema';

const STORAGE_KEY = 'english-platform-editor.lesson';

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

export const useLessonEditor = () => {
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'json'>('preview');
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [jsonFeedback, setJsonFeedback] = useState<string | null>(null);
  const [lesson, setLesson] = useState(readStoredLesson);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lesson));
  }, [lesson]);

  const handleImport = () => {
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

      setLesson(normalized);
      setImportError(null);
      setJsonFeedback('Lesson imported successfully.');
      setJsonInput(JSON.stringify(normalized, null, 2));
    } catch {
      setImportError('Invalid JSON syntax. Review the structure and try again.');
      setJsonFeedback(null);
    }
  };

  const addBlock = (type: BlockType, insertIndex?: number) => {
    setLesson((prev) => {
      const newBlock = createBlock(type, nextPageNumber(prev.blocks));
      const newBlocks = [...prev.blocks];
      if (insertIndex !== undefined) newBlocks.splice(insertIndex, 0, newBlock);
      else newBlocks.push(newBlock);
      return { ...prev, blocks: syncPageBreaks(newBlocks) };
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setLesson((prev) => {
      const newBlocks = [...prev.blocks];
      if (direction === 'up' && index > 0)
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      else if (direction === 'down' && index < newBlocks.length - 1)
        [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      return { ...prev, blocks: syncPageBreaks(newBlocks) };
    });
  };

  const updateBlock = (id: string, updatedFields: Partial<LessonBlock>) => {
    setLesson((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === id ? ({ ...b, ...updatedFields } as LessonBlock) : b
      )
    }));
  };

  const removeBlock = (id: string) =>
    setLesson((prev) => ({
      ...prev,
      blocks: syncPageBreaks(prev.blocks.filter((b) => b.id !== id))
    }));

  const updateTitle = (title: string) => setLesson((prev) => ({ ...prev, title }));

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

  const exportJson = () => {
    const payload = JSON.stringify(lesson, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'lesson'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setJsonFeedback('JSON exported successfully.');
    setImportError(null);
  };

  const resetLesson = () => {
    const emptyLesson = createEmptyLesson();
    setLesson(emptyLesson);
    setJsonInput(JSON.stringify(emptyLesson, null, 2));
    setImportError(null);
    setJsonFeedback('Blank lesson created.');
  };

  return {
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
  };
};
