import { PenLine } from 'lucide-react';
import { WritingTaskForm, WritingTaskPreview } from '../WritingTaskBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const writingTaskBlockDefinition: BlockDefinition = {
  type: 'writing-task',
  label: 'Writing Task',
  category: 'Production & Speaking',
  icon: PenLine,
  accent: 'text-stone-700',
  surface: 'from-stone-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'writing-task',
    title: 'Writing Task',
    prompt: 'Write a short response using the target language from the lesson.',
    minWords: 60
  }),
  form: WritingTaskForm as BlockFormComponent,
  preview: WritingTaskPreview as BlockPreviewComponent
};
