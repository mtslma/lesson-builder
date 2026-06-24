import { ScanText } from 'lucide-react';
import { RewriteQuestionForm, RewriteQuestionPreview } from '../RewriteQuestionBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const rewriteQuestionBlockDefinition: BlockDefinition = {
  type: 'rewrite-question',
  label: 'Transform Text',
  category: 'Practice & Quizzes',
  icon: ScanText,
  accent: 'text-slate-700',
  surface: 'from-slate-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'rewrite-question',
    instruction: 'Rewrite each sentence according to the instruction.',
    examples: [{ input: 'Sample statement.', output: 'Sample transformed version.' }],
    items: ['Rewrite this sentence.']
  }),
  form: RewriteQuestionForm as BlockFormComponent,
  preview: RewriteQuestionPreview as BlockPreviewComponent
};
