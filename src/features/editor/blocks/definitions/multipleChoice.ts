import { CheckCheck } from 'lucide-react';
import { MultipleChoiceForm, MultipleChoicePreview } from '../MultipleChoiceBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import { createMultipleChoiceOption } from '../../domain/blockDefaults';

export const multipleChoiceBlockDefinition: BlockDefinition = {
  type: 'multiple-choice',
  label: 'Multiple Choice',
  category: 'Practice & Quizzes',
  icon: CheckCheck,
  accent: 'text-green-700',
  surface: 'from-green-100 to-white',
  create: () => {
    const firstOptionId = createEditorId();
    const secondOptionId = createEditorId();

    return {
      id: createEditorId(),
      type: 'multiple-choice',
      question: 'Choose the best answer.',
      options: [
        { id: firstOptionId, text: 'Option A' },
        { id: secondOptionId, text: 'Option B' }
      ],
      correctOptionIds: [firstOptionId]
    };
  },
  form: MultipleChoiceForm as BlockFormComponent,
  preview: MultipleChoicePreview as BlockPreviewComponent,
  normalize: (block) => {
    const options = Array.isArray(block.options)
      ? block.options
          .filter((option): option is Record<string, unknown> => Boolean(option && typeof option === 'object'))
          .map((option) => ({
            ...createMultipleChoiceOption(),
            id: typeof option.id === 'string' ? option.id : createEditorId(),
            text: typeof option.text === 'string' ? option.text : ''
          }))
      : [];

    const validOptionIds = new Set(options.map((option) => option.id));

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'multiple-choice',
      question: typeof block.question === 'string' ? block.question : '',
      options,
      correctOptionIds: Array.isArray(block.correctOptionIds)
        ? block.correctOptionIds.filter(
            (optionId): optionId is string =>
              typeof optionId === 'string' && validOptionIds.has(optionId)
          )
        : []
    };
  }
};
