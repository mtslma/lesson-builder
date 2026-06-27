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
    items: Array.isArray(block.items) && block.items.length > 0
      ? block.items.map((item) => {
          const itemRecord =
            item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

          const legacySequence = Array.isArray(itemRecord.sequence)
            ? itemRecord.sequence.filter((token): token is string => typeof token === 'string')
            : [];

          return {
            id: typeof itemRecord.id === 'string' ? itemRecord.id : createEditorId(),
            prompt:
              typeof itemRecord.prompt === 'string' ? itemRecord.prompt : 'Put the sentence in order.',
            sentence:
              typeof itemRecord.sentence === 'string'
                ? itemRecord.sentence
                : legacySequence.join(' ')
          };
        })
      : [createWordOrderItem()]
  })
};
