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
    pairs: [{ left: 'Word', leftType: 'text', right: 'Meaning' }]
  }),
  form: VocabularyMatchForm as BlockFormComponent,
  preview: VocabularyMatchPreview as BlockPreviewComponent
};
