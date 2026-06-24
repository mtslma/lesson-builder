import { CheckCheck } from 'lucide-react';
import { MultipleChoiceForm, MultipleChoicePreview } from '../MultipleChoiceBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

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
  preview: MultipleChoicePreview as BlockPreviewComponent
};
