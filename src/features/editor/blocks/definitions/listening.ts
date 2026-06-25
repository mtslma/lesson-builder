import { Headphones } from 'lucide-react';
import { ListeningForm, ListeningPreview } from '../ListeningBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createSubQuestion, normalizeSubQuestions } from '../../domain/blockDefaults';
import {
  createConversationMessage,
  normalizeConversationHighlights,
  normalizeConversationMessageInput
} from '../../domain/conversation';
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
    instruction: 'Listen carefully and answer the questions below.',
    audioUrl: 'audio-track.mp3',
    script: [
      createConversationMessage({ speaker: 'Speaker A', text: 'Hello. Welcome to the listening activity.' }),
      createConversationMessage({ speaker: 'Speaker B', text: 'Thank you. I am ready.' })
    ],
    transcriptVisibility: 'hidden',
    questions: [
      createSubQuestion('open-ended', 'What is one thing Speaker A says?'),
      createSubQuestion('multiple-choice', 'What is the speaker describing?', ['A routine', 'A place', 'A preference'])
    ]
  }),
  form: ListeningForm as BlockFormComponent,
  preview: ListeningPreview as BlockPreviewComponent,
  normalize: (block) => {
    const rawScript = Array.isArray(block.script)
      ? block.script.filter((message): message is Record<string, unknown> => Boolean(message && typeof message === 'object'))
      : [];

    const script =
      rawScript.length > 0
        ? rawScript.map((message) => {
            const normalized = normalizeConversationMessageInput(message) as Record<string, unknown>;

            return {
              id: typeof normalized.id === 'string' ? normalized.id : createEditorId(),
              speaker: typeof normalized.speaker === 'string' ? normalized.speaker : '',
              text: typeof normalized.text === 'string' ? normalized.text : '',
              highlights: normalizeConversationHighlights(normalized)
            };
          })
        : (typeof block.transcript === 'string' ? block.transcript : '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const separatorIndex = line.indexOf(':');
              const hasSpeaker = separatorIndex > 0;

              return createConversationMessage({
                speaker: hasSpeaker ? line.slice(0, separatorIndex).trim() : '',
                text: hasSpeaker ? line.slice(separatorIndex + 1).trim() : line
              });
            });

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'listening',
      title: typeof block.title === 'string' ? block.title : '',
      instruction: typeof block.instruction === 'string' ? block.instruction : '',
      audioUrl: typeof block.audioUrl === 'string' ? block.audioUrl : '',
      contextImageUrl: typeof block.contextImageUrl === 'string' ? block.contextImageUrl : undefined,
      script,
      transcriptVisibility:
        block.transcriptVisibility === 'hidden' ||
        block.transcriptVisibility === 'after-answer' ||
        block.transcriptVisibility === 'always'
          ? block.transcriptVisibility
          : 'hidden',
      questions: normalizeSubQuestions(block.questions)
    };
  }
};
