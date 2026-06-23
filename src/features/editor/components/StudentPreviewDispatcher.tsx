import React from 'react';
import type { LessonBlock } from '../types/index';
import { BLOCK_DEFINITION_MAP } from '../config/blockRegistry';

export const StudentPreviewDispatcher: React.FC<{ block: LessonBlock }> = ({ block }) => {
  const definition = BLOCK_DEFINITION_MAP[block.type];

  if (!definition) {
    throw new Error(`Unsupported block type: ${block.type}`);
  }

  const PreviewComponent = definition.preview;

  if (PreviewComponent) {
    return <PreviewComponent block={block} />;
  }

  return (
    <div className="my-4 p-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50 font-mono">
      [{block.type}] visual renderer pending.
    </div>
  );
};
