import type { BlockType } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';

export const BLOCK_LABELS: Record<BlockType, string> = Object.fromEntries(
  (Object.keys(BLOCK_DEFINITION_MAP) as BlockType[]).map((type) => [type, BLOCK_DEFINITION_MAP[type].label])
) as Record<BlockType, string>;
