import React from 'react';
import type { LessonBlock } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';

type BlockFormComponent = React.ComponentType<{
  block: LessonBlock;
  onUpdate: (fields: Partial<LessonBlock>) => void;
}>;

export const blockFormRegistry: Partial<Record<LessonBlock['type'], BlockFormComponent>> = {};

for (const definition of Object.values(BLOCK_DEFINITION_MAP)) {
  if (!definition.form) continue;
  blockFormRegistry[definition.type] = definition.form as BlockFormComponent;
}
