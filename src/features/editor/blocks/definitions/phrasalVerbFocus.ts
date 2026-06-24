import { Sparkles } from 'lucide-react';
import { PhrasalVerbForm, PhrasalVerbPreview } from '../PhrasalVerbFocusBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const phrasalVerbFocusBlockDefinition: BlockDefinition = {
  type: 'phrasal-verb-focus',
  label: 'Phrasal Verbs',
  category: 'Interactive & Vocab',
  icon: Sparkles,
  accent: 'text-violet-700',
  surface: 'from-violet-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'phrasal-verb-focus',
    title: 'Phrasal Verb Set',
    items: [
      {
        id: createEditorId(),
        verb: 'Target expression',
        meaning: 'Add a short neutral meaning here.',
        examples: ['Example sentence one.', 'Example sentence two.']
      }
    ]
  }),
  form: PhrasalVerbForm as BlockFormComponent,
  preview: PhrasalVerbPreview as BlockPreviewComponent,
  normalize: (block) => {
    const typedItems = Array.isArray(block.items) ? block.items : undefined;

    const normalizedItems =
      typedItems && typedItems.length > 0
        ? typedItems.slice(0, 6).map((item) => ({
            id:
              item && typeof item === 'object' && typeof item.id === 'string'
                ? item.id
                : createEditorId(),
            verb:
              item && typeof item === 'object' && typeof item.verb === 'string' ? item.verb : '',
            meaning:
              item && typeof item === 'object' && typeof item.meaning === 'string'
                ? item.meaning
                : '',
            examples:
              item && typeof item === 'object' && Array.isArray(item.examples)
                ? item.examples.filter(
                    (example: unknown): example is string => typeof example === 'string'
                  )
                : []
          }))
        : [
            {
              id: createEditorId(),
              verb: typeof block.verb === 'string' ? block.verb : '',
              meaning: typeof block.meaning === 'string' ? block.meaning : '',
              examples: Array.isArray(block.examples)
                ? block.examples.filter(
                    (example: unknown): example is string => typeof example === 'string'
                  )
                : []
            }
          ];

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'phrasal-verb-focus',
      title: typeof block.title === 'string' ? block.title : 'Phrasal Verb Set',
      verb: typeof block.verb === 'string' ? block.verb : undefined,
      meaning: typeof block.meaning === 'string' ? block.meaning : undefined,
      examples: Array.isArray(block.examples)
        ? block.examples.filter((example: unknown): example is string => typeof example === 'string')
        : undefined,
      items: normalizedItems
    };
  }
};
