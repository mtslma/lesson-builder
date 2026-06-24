import type { BlockAudience, BlockType, Lesson, LessonBlock, PublicLesson } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';
import { createEditorId } from '../domain/ids';

const DEFAULT_AUDIENCE: BlockAudience = 'both';
const readAudience = (value: unknown): BlockAudience =>
  value === 'student' || value === 'teacher' || value === 'both' ? value : DEFAULT_AUDIENCE;

export const createEmptyLesson = (): Lesson => ({
  schemaVersion: 1,
  id: createEditorId(),
  title: 'Untitled lesson',
  level: '',
  language: 'en',
  blocks: []
});

export const createBlock = (type: BlockType, pageNumber: number): LessonBlock => {
  const definition = BLOCK_DEFINITION_MAP[type];
  if (!definition) {
    throw new Error(`Unsupported block type: ${type}`);
  }
  const block = definition.create(pageNumber);
  return { ...block, audience: block.audience || DEFAULT_AUDIENCE };
};

export const syncPageBreaks = (blocks: LessonBlock[]) => {
  let pageNumber = 0;

  return blocks.map((block) => {
    if (block.type !== 'page-break') return block;

    pageNumber += 1;
    return { ...block, pageNumber };
  });
};

export const nextPageNumber = (blocks: LessonBlock[]) =>
  blocks.filter((block) => block.type === 'page-break').length + 1;

export const normalizeLesson = (input: unknown): Lesson | null => {
  if (!input || typeof input !== 'object') return null;

  const candidate = input as Partial<Lesson> & { blocks?: unknown[] };
  if (!Array.isArray(candidate.blocks)) return null;

  const normalizedBlocks: LessonBlock[] = [];

  for (const rawBlock of candidate.blocks) {
    if (!rawBlock || typeof rawBlock !== 'object') continue;

    const blockRecord = rawBlock as unknown as Record<string, unknown>;
    const type = blockRecord.type;

    if (typeof type !== 'string') continue;

    const definition = BLOCK_DEFINITION_MAP[type as BlockType];
    if (!definition) continue;

    const normalizedBlock = definition.normalize
      ? definition.normalize({
          ...blockRecord,
          id: typeof blockRecord.id === 'string' ? blockRecord.id : createEditorId(),
          type
        })
      : definition.create(nextPageNumber(normalizedBlocks));

    normalizedBlocks.push({
      ...normalizedBlock,
      audience: normalizedBlock.audience || readAudience(blockRecord.audience)
    });
  }

  return {
    schemaVersion: 1,
    id: candidate.id || createEditorId(),
    title: candidate.title || 'Untitled lesson',
    level: candidate.level || '',
    language: candidate.language || 'en',
    blocks: syncPageBreaks(normalizedBlocks)
  };
};

const renewIdsDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => renewIdsDeep(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const nextRecord: Record<string, unknown> = {};

  Object.entries(record).forEach(([key, entryValue]) => {
    if (key === 'id' && typeof entryValue === 'string') {
      nextRecord[key] = createEditorId();
      return;
    }

    nextRecord[key] = renewIdsDeep(entryValue);
  });

  return nextRecord;
};

export const duplicateBlock = (block: LessonBlock): LessonBlock => {
  const duplicated = renewIdsDeep(structuredClone(block)) as LessonBlock;

  if (duplicated.type === 'multiple-choice') {
    duplicated.correctOptionIds = duplicated.options
      .filter((_, index) => block.type === 'multiple-choice' && block.correctOptionIds.includes(block.options[index]?.id))
      .map((option) => option.id);
  }

  if (duplicated.type === 'fill-blank' && block.type === 'fill-blank') {
    duplicated.text = block.text
      .replace(/\{\{([^}]+)\}\}/g, '[]')
      .replace(/\[\]/g, '[]');
  }

  return { ...duplicated, audience: duplicated.audience || DEFAULT_AUDIENCE };
};

const sanitizeSubQuestion = <T extends { answer?: string }>(question: T): Omit<T, 'answer'> => {
  const rest = { ...question };
  delete rest.answer;
  return rest;
};

export const createPublicLesson = (lesson: Lesson): PublicLesson => ({
  ...lesson,
  blocks: lesson.blocks
    .filter((block) => block.type !== 'teacher-note')
    .filter((block) => block.audience !== 'teacher')
    .map((block): unknown => {
      switch (block.type) {
        case 'listening':
          return {
            ...block,
            audience: block.audience === 'both' ? 'both' : 'student',
            questions: block.questions.map((question) => sanitizeSubQuestion(question))
          };
        case 'reading-comprehension':
          return {
            ...block,
            audience: block.audience === 'both' ? 'both' : 'student',
            questions: block.questions.map((question) => sanitizeSubQuestion(question))
          };
        case 'multiple-choice': {
          const rest = { ...block } as Record<string, unknown>;
          delete rest.correctOptionIds;
          return rest as unknown;
        }
        case 'fill-blank':
          return {
            ...block,
            gaps: block.gaps.map((gap) => ({ id: gap.id }))
          };
        case 'selection-grid':
          return {
            ...block,
            items: block.items.map((item) => {
              const nextItem = { ...item };
              delete nextItem.isCorrect;
              return nextItem;
            })
          };
        default:
          return {
            ...block,
            audience: block.audience === 'teacher' ? 'student' : block.audience
          };
      }
    })
});
