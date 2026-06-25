import { WholeWord } from 'lucide-react';
import { LetterNumberForm, LetterNumberPreview } from '../LetterNumberBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

const alphabetItems = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((symbol) => ({
  id: createEditorId(),
  symbol,
  label: symbol.toLowerCase()
}));

export const letterNumberBlockDefinition: BlockDefinition = {
  type: 'letter-number',
  label: 'Letters / Numbers',
  category: 'Layout & Theory',
  icon: WholeWord,
  accent: 'text-slate-700',
  surface: 'from-slate-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'letter-number',
    title: 'Alphabet',
    instruction: '',
    variant: 'letters',
    density: 'compact',
    itemsPerRow: 6,
    items: alphabetItems
  }),
  form: LetterNumberForm as BlockFormComponent,
  preview: LetterNumberPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'letter-number',
    title: typeof block.title === 'string' ? block.title : 'Alphabet',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    variant:
      block.variant === 'numbers' || block.variant === 'mixed' || block.variant === 'letters'
        ? block.variant
        : 'letters',
    density: block.density === 'regular' ? 'regular' : 'compact',
    itemsPerRow:
      typeof block.itemsPerRow === 'number' && Number.isFinite(block.itemsPerRow)
        ? Math.min(Math.max(Math.round(block.itemsPerRow), 1), 10)
        : 6,
    items: Array.isArray(block.items)
      ? block.items
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((item) => ({
            id: typeof item.id === 'string' ? item.id : createEditorId(),
            symbol: typeof item.symbol === 'string' ? item.symbol : '',
            label: typeof item.label === 'string' ? item.label : ''
          }))
      : alphabetItems
  })
};
