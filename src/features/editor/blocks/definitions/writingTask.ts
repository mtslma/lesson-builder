import { PenLine } from 'lucide-react';
import { WritingTaskForm, WritingTaskPreview } from '../WritingTaskBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const writingTaskBlockDefinition: BlockDefinition = {
  type: 'writing-task',
  label: 'Writing Task',
  category: 'Production & Speaking',
  icon: PenLine,
  accent: 'text-stone-700',
  surface: 'from-stone-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'writing-task',
    title: 'Writing Task',
    prompt: 'Write a short response using the target language from the lesson.',
    sentenceStarters: ['I usually...', 'My favorite...'],
    suggestedVocabulary: ['morning', 'afternoon', 'favorite'],
    grammarReminder: 'Use the simple present.',
    checklist: ['Write complete sentences.', 'Use the target grammar.'],
    rubric: 'Clear ideas, correct target grammar, enough detail.',
    minWords: 60
  }),
  form: WritingTaskForm as BlockFormComponent,
  preview: WritingTaskPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'writing-task',
    title: typeof block.title === 'string' ? block.title : 'Writing Task',
    prompt: typeof block.prompt === 'string' ? block.prompt : '',
    sentenceStarters: Array.isArray(block.sentenceStarters)
      ? block.sentenceStarters.filter((item): item is string => typeof item === 'string')
      : [],
    suggestedVocabulary: Array.isArray(block.suggestedVocabulary)
      ? block.suggestedVocabulary.filter((item): item is string => typeof item === 'string')
      : [],
    grammarReminder: typeof block.grammarReminder === 'string' ? block.grammarReminder : '',
    checklist: Array.isArray(block.checklist)
      ? block.checklist.filter((item): item is string => typeof item === 'string')
      : [],
    minWords: typeof block.minWords === 'number' ? block.minWords : undefined,
    rubric: typeof block.rubric === 'string' ? block.rubric : ''
  })
};
