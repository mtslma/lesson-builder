import { Languages } from 'lucide-react';
import { VocabularyMatchForm, VocabularyMatchPreview } from '../VocabularyMatchBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const vocabularyMatchBlockDefinition: BlockDefinition = {
  type: 'vocabulary-match',
  label: 'Match Pairs',
  category: 'Interactive & Vocab',
  icon: Languages,
  accent: 'text-fuchsia-700',
  surface: 'from-fuchsia-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'vocabulary-match',
    title: 'Match the related items',
    instruction: 'Connect each item on the left to its related item on the right.',
    variant: 'classic',
    matchMode: 'word-to-meaning',
    shuffleLeft: false,
    shuffleRight: true,
    showReferenceBadges: true,
    showCorrectMatches: false,
    pairs: [
      {
        id: createEditorId(),
        left: 'Word',
        leftType: 'text',
        leftLabel: '',
        right: 'Meaning',
        rightType: 'text',
        rightLabel: ''
      },
      {
        id: createEditorId(),
        left: 'Phrase',
        leftType: 'text',
        leftLabel: '',
        right: 'Response',
        rightType: 'text',
        rightLabel: ''
      }
    ]
  }),
  form: VocabularyMatchForm as BlockFormComponent,
  preview: VocabularyMatchPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'vocabulary-match',
    title: typeof block.title === 'string' ? block.title : 'Match the related items',
    instruction:
      typeof block.instruction === 'string'
        ? block.instruction
        : 'Connect each item on the left to its related item on the right.',
    variant:
      block.variant === 'cards' || block.variant === 'two-column' ? block.variant : 'classic',
    matchMode:
      block.matchMode === 'text-to-text' ||
      block.matchMode === 'image-to-word' ||
      block.matchMode === 'audio-to-word' ||
      block.matchMode === 'word-to-meaning' ||
      block.matchMode === 'phrase-to-response' ||
      block.matchMode === 'category-matching'
        ? block.matchMode
        : 'word-to-meaning',
    shuffleLeft: typeof block.shuffleLeft === 'boolean' ? block.shuffleLeft : false,
    shuffleRight: typeof block.shuffleRight === 'boolean' ? block.shuffleRight : true,
    showReferenceBadges:
      typeof block.showReferenceBadges === 'boolean' ? block.showReferenceBadges : true,
    showCorrectMatches:
      typeof block.showCorrectMatches === 'boolean' ? block.showCorrectMatches : false,
    pairs: Array.isArray(block.pairs)
      ? block.pairs
          .filter((pair): pair is Record<string, unknown> => Boolean(pair && typeof pair === 'object'))
          .map((pair) => ({
            id: typeof pair.id === 'string' ? pair.id : createEditorId(),
            left: typeof pair.left === 'string' ? pair.left : '',
            leftType:
              pair.leftType === 'image' || pair.leftType === 'audio' || pair.leftType === 'category'
                ? pair.leftType
                : 'text',
            leftLabel: typeof pair.leftLabel === 'string' ? pair.leftLabel : '',
            right: typeof pair.right === 'string' ? pair.right : '',
            rightType:
              pair.rightType === 'image' || pair.rightType === 'audio' || pair.rightType === 'category'
                ? pair.rightType
                : 'text',
            rightLabel: typeof pair.rightLabel === 'string' ? pair.rightLabel : ''
          }))
      : []
  })
};
