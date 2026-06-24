import type { BlockType } from '../types/index';
import type { BlockDefinition } from './blockDefinition';
import { BLOCK_DEFINITIONS } from '../blocks/definitions';

export { BLOCK_DEFINITIONS };
export type { BlockDefinition };

export const BLOCK_DEFINITION_MAP = Object.fromEntries(
  BLOCK_DEFINITIONS.map((definition) => [definition.type, definition])
) as Record<BlockType, BlockDefinition>;
