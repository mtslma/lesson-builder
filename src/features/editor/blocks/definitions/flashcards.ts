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
    variant: 'grid',
    cards: [
      {
        ...createFlashcard(),
        expressions: ['Target word'],
        shortMeaning: 'Meaning or explanation',
        backText: 'Meaning or explanation',
        exampleSentence: 'Example sentence here.'
      }
    ]
  }),
  form: FlashcardsForm as BlockFormComponent,
  preview: FlashcardsPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'flashcards',
    title: typeof block.title === 'string' ? block.title : 'Flashcard Set',
    category: typeof block.category === 'string' ? block.category : '',
    variant:
      block.variant === 'grid' || block.variant === 'list' || block.variant === 'carousel' || block.variant === 'study'
        ? block.variant
        : 'grid',
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
            backImage: typeof card.backImage === 'string' ? card.backImage : undefined,
            imageFit: card.imageFit === 'contain' ? 'contain' : 'cover',
            imagePositionX:
              typeof card.imagePositionX === 'number' && Number.isFinite(card.imagePositionX)
                ? Math.min(Math.max(card.imagePositionX, 0), 100)
                : 50,
            imagePositionY:
              typeof card.imagePositionY === 'number' && Number.isFinite(card.imagePositionY)
                ? Math.min(Math.max(card.imagePositionY, 0), 100)
                : 50,
            imageZoom:
              typeof card.imageZoom === 'number' && Number.isFinite(card.imageZoom)
                ? Math.min(Math.max(card.imageZoom, 50), 200)
                : 100,
            audioUrl: typeof card.audioUrl === 'string' ? card.audioUrl : undefined,
            exampleSentence: typeof card.exampleSentence === 'string' ? card.exampleSentence : undefined,
            translation: typeof card.translation === 'string' ? card.translation : undefined,
            shortMeaning:
              typeof card.shortMeaning === 'string'
                ? card.shortMeaning
                : typeof card.backText === 'string'
                  ? card.backText
                  : undefined,
            category: typeof card.category === 'string' ? card.category : undefined,
            tags: Array.isArray(card.tags)
              ? card.tags.filter((tag): tag is string => typeof tag === 'string')
              : []
          }))
      : []
  })
};
