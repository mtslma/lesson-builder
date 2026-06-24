import type {
  FlashcardsBlock,
  ImageChoiceBlock,
  ImageNumberingBlock,
  MultipleChoiceBlock,
  PhrasalVerbFocusBlock,
  SelectionGridBlock,
  SubQuestion,
  VocabularyMatchBlock
} from '../types/index';
import { createEditorId } from './ids';

export const createSubQuestion = (
  type: SubQuestion['type'] = 'multiple-choice',
  question = '',
  options?: string[]
): SubQuestion => ({
  id: createEditorId(),
  type,
  question,
  ...(options ? { options } : {})
});

export const createFlashcard = (): FlashcardsBlock['cards'][number] => ({
  id: createEditorId(),
  expressions: [''],
  frontImage: '',
  backText: '',
  backImage: ''
});

export const createImageChoiceOption = (): ImageChoiceBlock['options'][number] => ({
  id: createEditorId(),
  text: '',
  imageUrl: ''
});

export const createImageNumberingItem = (): ImageNumberingBlock['items'][number] => ({
  id: createEditorId(),
  imageUrl: '',
  correctNumber: 1,
  label: ''
});

export const createSelectionGridItem = (): SelectionGridBlock['items'][number] => ({
  id: createEditorId(),
  text: '',
  isCorrect: false
});

export const createMultipleChoiceOption = (): MultipleChoiceBlock['options'][number] => ({
  id: createEditorId(),
  text: ''
});

export const createPhrasalVerbItem = (): PhrasalVerbFocusBlock['items'][number] => ({
  id: createEditorId(),
  verb: '',
  meaning: '',
  examples: []
});

export const createVocabularyPair = (): VocabularyMatchBlock['pairs'][number] => ({
  left: '',
  leftType: 'text',
  right: ''
});
