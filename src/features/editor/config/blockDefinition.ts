import type { LucideIcon } from 'lucide-react';
import type { BlockType, LessonBlock } from '../types/index';

export type BlockFormComponent = React.ComponentType<{
  block: LessonBlock;
  onUpdate: (fields: Partial<LessonBlock>) => void;
}>;

export type BlockPreviewComponent = React.ComponentType<{ block: LessonBlock }>;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: string;
  icon: LucideIcon;
  accent: string;
  surface: string;
  create: (pageNumber: number) => LessonBlock;
  form?: BlockFormComponent;
  preview?: BlockPreviewComponent;
  normalize?: (block: Record<string, unknown>) => LessonBlock;
}
