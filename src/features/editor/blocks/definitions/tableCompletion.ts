import { normalizeSubQuestions } from '../../domain/blockDefaults';
import { TableProperties } from 'lucide-react';
import { TableCompletionForm, TableCompletionPreview } from '../TableCompletionBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const tableCompletionBlockDefinition: BlockDefinition = {
  type: 'table-completion',
  label: 'Table Completion',
  category: 'Practice & Quizzes',
  icon: TableProperties,
  accent: 'text-emerald-700',
  surface: 'from-emerald-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'table-completion',
    title: 'Complete the table',
    instruction: 'Use the lesson information to complete the table.',
    headers: ['Item', 'Answer'],
    rows: [
      { id: createEditorId(), cells: ['Row 1', ''] },
      { id: createEditorId(), cells: ['Row 2', ''] },
      { id: createEditorId(), cells: ['Row 3', ''] }
    ],
    questions: []
  }),
  form: TableCompletionForm as BlockFormComponent,
  preview: TableCompletionPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'table-completion',
    title: typeof block.title === 'string' ? block.title : 'Complete the table',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    headers: Array.isArray(block.headers) ? block.headers.filter((item): item is string => typeof item === 'string') : ['Item', 'Answer'],
    rows: Array.isArray(block.rows) ? block.rows : [],
    questions: normalizeSubQuestions(block.questions)
  })
};
