import { Headphones } from 'lucide-react';
import { ListeningForm, ListeningPreview } from '../ListeningBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createSubQuestion } from '../../domain/blockDefaults';
import { normalizeConversationHighlights } from '../../domain/conversation';
import { createEditorId } from '../../domain/ids';

export const listeningBlockDefinition: BlockDefinition = {
  type: 'listening',
  label: 'Listen & Answer',
  category: 'Reading & Media',
  icon: Headphones,
  accent: 'text-rose-700',
  surface: 'from-rose-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'listening',
    title: 'Listening Track',
    audioUrl: 'audio-track.mp3',
    transcript: '',
    transcriptHighlights: [],
    transcriptVisibility: 'hidden',
    questions: [
      createSubQuestion('true-false', 'The speaker agrees with the main idea.'),
      createSubQuestion('multiple-choice', 'What is the speaker describing?', [
        'A routine',
        'A place',
        'A preference'
      ])
    ]
  }),
  form: ListeningForm as BlockFormComponent,
  preview: ListeningPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'listening',
    title: typeof block.title === 'string' ? block.title : '',
    audioUrl: typeof block.audioUrl === 'string' ? block.audioUrl : '',
    contextImageUrl: typeof block.contextImageUrl === 'string' ? block.contextImageUrl : undefined,
    transcript: typeof block.transcript === 'string' ? block.transcript : '',
    transcriptHighlights: normalizeConversationHighlights({
      text: typeof block.transcript === 'string' ? block.transcript : '',
      highlights: block.transcriptHighlights
    }),
    transcriptVisibility:
      block.transcriptVisibility === 'hidden' ||
      block.transcriptVisibility === 'after-answer' ||
      block.transcriptVisibility === 'always'
        ? block.transcriptVisibility
        : 'hidden',
    questions: Array.isArray(block.questions) ? block.questions : []
  })
};
