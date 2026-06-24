import { Languages } from 'lucide-react';
import { FlashcardsForm, FlashcardsPreview } from '../FlashcardsBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createFlashcard } from '../../domain/blockDefaults';
import { createEditorId } from '../../domain/ids';

export const flashcardsBlockDefinition: BlockDefinition = {
  type: 'flashcards',
  label: 'Flashcards',
  category: 'Interactive & Vocab',
  icon: Languages,
  accent: 'text-fuchsia-700',
  surface: 'from-fuchsia-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'flashcards',
    title: 'Flashcard Set',
    category: '',
    tags: [],
    cards: [{ ...createFlashcard(), expressions: ['Target word'], backText: 'Meaning or explanation' }]
  }),
  form: FlashcardsForm as BlockFormComponent,
  preview: FlashcardsPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'flashcards',
    title: typeof block.title === 'string' ? block.title : 'Flashcard Set',
    category: typeof block.category === 'string' ? block.category : '',
    tags: Array.isArray(block.tags)
      ? block.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    cards: Array.isArray(block.cards)
      ? block.cards
          .filter((card): card is Record<string, unknown> => Boolean(card && typeof card === 'object'))
          .map((card) => ({
            id: typeof card.id === 'string' ? card.id : createEditorId(),
            expressions: Array.isArray(card.expressions)
              ? card.expressions.filter(
                  (expression): expression is string => typeof expression === 'string'
                )
              : typeof card.frontText === 'string'
                ? [card.frontText]
                : [],
            frontImage: typeof card.frontImage === 'string' ? card.frontImage : undefined,
            backText: typeof card.backText === 'string' ? card.backText : '',
            backImage: typeof card.backImage === 'string' ? card.backImage : undefined
          }))
      : []
  })
};
