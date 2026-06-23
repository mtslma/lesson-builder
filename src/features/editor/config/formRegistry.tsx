import React from 'react';
import type { LessonBlock } from '../types/index';
import { BLOCK_DEFINITION_MAP } from './blockRegistry';

type BlockFormComponent = React.ComponentType<{
  block: LessonBlock;
  onUpdate: (fields: Partial<LessonBlock>) => void;
}>;

export const blockFormRegistry: Partial<Record<LessonBlock['type'], BlockFormComponent>> =
  Object.fromEntries(
    (Object.keys(BLOCK_DEFINITION_MAP) as LessonBlock['type'][])
      .filter((type) => !!BLOCK_DEFINITION_MAP[type].form)
      .map((type) => [type, BLOCK_DEFINITION_MAP[type].form as BlockFormComponent])
  );
