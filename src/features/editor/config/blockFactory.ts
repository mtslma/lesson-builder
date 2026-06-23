import type { BlockType, Lesson, LessonBlock } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';

const createId = () => crypto.randomUUID();

export const createEmptyLesson = (): Lesson => ({
  schemaVersion: 1,
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
          id: typeof blockRecord.id === 'string' ? blockRecord.id : createId(),
          type
        })
      : definition.create(nextPageNumber(normalizedBlocks));

    normalizedBlocks.push(normalizedBlock);
  }

  return {
    schemaVersion: 1,
    id: candidate.id || createId(),
    title: candidate.title || 'Untitled lesson',
    level: candidate.level || '',
    language: candidate.language || 'en',
    blocks: syncPageBreaks(normalizedBlocks)
  };
};
