import { Blocks } from 'lucide-react';
import { QuestionSetForm, QuestionSetPreview } from '../QuestionSetBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import {
  createQuestionBuilderItem,
  createQuestionSetDefaults,
  normalizeQuestionBuilderItems,
  normalizeSubQuestions
} from '../../domain/blockDefaults';

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
    practiceMode: block.practiceMode === 'question-builder' ? 'question-builder' : 'mixed',
    questions: normalizeSubQuestions(block.questions),
    questionBuilderItems:
      normalizeQuestionBuilderItems(block.questionBuilderItems).length > 0
        ? normalizeQuestionBuilderItems(block.questionBuilderItems)
        : [createQuestionBuilderItem()]
  })
};
