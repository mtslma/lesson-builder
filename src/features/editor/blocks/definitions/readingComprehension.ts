import { BookOpen } from 'lucide-react';
import { ReadingComprehensionForm, ReadingComprehensionPreview } from '../ReadingComprehensionBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createSubQuestion } from '../../domain/blockDefaults';
import { createEditorId } from '../../domain/ids';

export const readingComprehensionBlockDefinition: BlockDefinition = {
  type: 'reading-comprehension',
  label: 'Read & Answer',
  category: 'Reading & Media',
  icon: BookOpen,
  accent: 'text-emerald-700',
  surface: 'from-emerald-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'reading-comprehension',
    title: 'Reading Task',
    text: 'Insert a short neutral text here for reading practice and comprehension work.',
    questions: [
      createSubQuestion('multiple-choice', 'What is the text mainly about?', [
        'A person',
        'An activity',
        'A routine'
      ]),
      createSubQuestion('open-ended', 'What detail supports your answer?')
    ]
  }),
  form: ReadingComprehensionForm as BlockFormComponent,
  preview: ReadingComprehensionPreview as BlockPreviewComponent
};
