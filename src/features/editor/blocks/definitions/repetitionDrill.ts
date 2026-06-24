import { MicVocal } from 'lucide-react';
import { RepetitionDrillForm, RepetitionDrillPreview } from '../RepetitionDrillBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const repetitionDrillBlockDefinition: BlockDefinition = {
  type: 'repetition-drill',
  label: 'Pronunciation',
  category: 'Interactive & Vocab',
  icon: MicVocal,
  accent: 'text-orange-700',
  surface: 'from-orange-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'repetition-drill',
    title: 'Pronunciation Drill',
    words: [
      { word: 'Target', phonetic: '/target/' },
      { word: 'Pattern', phonetic: '/pattern/' }
    ]
  }),
  form: RepetitionDrillForm as BlockFormComponent,
  preview: RepetitionDrillPreview as BlockPreviewComponent
};
