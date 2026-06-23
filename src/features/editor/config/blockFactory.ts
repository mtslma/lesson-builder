import type { BlockType, Lesson, LessonBlock } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';

const createId = () => crypto.randomUUID();

export const createEmptyLesson = (): Lesson => ({
  id: createId(),
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
  return definition.create(pageNumber);
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

  const normalizedBlocks = candidate.blocks.map((block) => {
    const normalizedBlock = {
      ...((block as unknown as Record<string, unknown>) || {}),
      id:
        typeof (block as { id?: unknown }).id === 'string'
          ? (block as { id: string }).id
          : createId()
    } as LessonBlock;

    const definition = BLOCK_DEFINITION_MAP[normalizedBlock.type];
    return definition.normalize ? definition.normalize(normalizedBlock) : normalizedBlock;
  });

  return {
    id: candidate.id || createId(),
    title: candidate.title || 'Untitled lesson',
    level: candidate.level || '',
    language: candidate.language || 'en',
    blocks: syncPageBreaks(normalizedBlocks as LessonBlock[])
  };
};
