import { BookOpen } from 'lucide-react';
import { ReadingComprehensionForm, ReadingComprehensionPreview } from '../ReadingComprehensionBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createSubQuestion, normalizeSubQuestions } from '../../domain/blockDefaults';
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
    imageUrl: '',
    audioUrl: '',
    textHighlights: [],
    glossaryItems: [
      { id: createEditorId(), term: 'neighbor', meaning: 'a person who lives near you' }
    ],
    discussionQuestions: ['Would you like to visit this place? Why?'],
    questions: [
      createSubQuestion('multiple-choice', 'What is the text mainly about?', [
        'A person',
        'An activity',
        'A routine'
      ]),
      createSubQuestion('find-in-text', 'Find one sentence that supports your answer.')
    ]
  }),
  form: ReadingComprehensionForm as BlockFormComponent,
  preview: ReadingComprehensionPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'reading-comprehension',
    title: typeof block.title === 'string' ? block.title : 'Reading Task',
    text: typeof block.text === 'string' ? block.text : '',
    imageUrl: typeof block.imageUrl === 'string' ? block.imageUrl : '',
    audioUrl: typeof block.audioUrl === 'string' ? block.audioUrl : '',
    textHighlights: Array.isArray(block.textHighlights) ? block.textHighlights : [],
    glossaryItems: Array.isArray(block.glossaryItems)
      ? block.glossaryItems.filter((item): item is { id: string; term: string; meaning: string } =>
          Boolean(
            item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.term === 'string' &&
              typeof item.meaning === 'string'
          )
        )
      : [],
    discussionQuestions: Array.isArray(block.discussionQuestions)
      ? block.discussionQuestions.filter((item): item is string => typeof item === 'string')
      : [],
    questions: normalizeSubQuestions(block.questions)
  })
};
