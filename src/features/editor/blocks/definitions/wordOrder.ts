import { ArrowLeftRight } from 'lucide-react';
import { WordOrderForm, WordOrderPreview } from '../WordOrderBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createWordOrderItem } from '../../domain/blockDefaults';
import { createEditorId } from '../../domain/ids';

export const wordOrderBlockDefinition: BlockDefinition = {
  type: 'word-order',
  label: 'Word Order',
  category: 'Practice & Quizzes',
  icon: ArrowLeftRight,
  accent: 'text-amber-700',
  surface: 'from-amber-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'word-order',
    title: 'Put the words in order',
    instruction: 'Reorder the words to make correct sentences.',
    items: [createWordOrderItem()]
  }),
  form: WordOrderForm as BlockFormComponent,
  preview: WordOrderPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'word-order',
    title: typeof block.title === 'string' ? block.title : 'Put the words in order',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    items: Array.isArray(block.items) ? block.items : [createWordOrderItem()]
  })
};
