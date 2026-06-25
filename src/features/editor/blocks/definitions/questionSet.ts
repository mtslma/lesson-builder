import { Blocks } from 'lucide-react';
import { QuestionSetForm, QuestionSetPreview } from '../QuestionSetBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import { createQuestionSetDefaults, normalizeSubQuestions } from '../../domain/blockDefaults';

export const questionSetBlockDefinition: BlockDefinition = {
  type: 'question-set',
  label: 'Mixed Practice',
  category: 'Practice & Quizzes',
  icon: Blocks,
  accent: 'text-sky-700',
  surface: 'from-sky-100 to-white',
  create: () => ({ id: createEditorId(), type: 'question-set', ...createQuestionSetDefaults() }),
  form: QuestionSetForm as BlockFormComponent,
  preview: QuestionSetPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'question-set',
    title: typeof block.title === 'string' ? block.title : 'Mixed Practice',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    questions: normalizeSubQuestions(block.questions)
  })
};
