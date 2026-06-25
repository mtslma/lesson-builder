import { MessageCircleMore } from 'lucide-react';
import { ConversationPromptsForm, ConversationPromptsPreview } from '../ConversationPromptsBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

const createSpeaker = (name: string) => ({
  id: createEditorId(),
  name
});

export const conversationPromptsBlockDefinition: BlockDefinition = {
  type: 'conversation-prompts',
  label: 'Talking',
  category: 'Production & Speaking',
  icon: MessageCircleMore,
  accent: 'text-sky-700',
  surface: 'from-sky-100 to-white',
  create: () => {
    const speakerA = createSpeaker('Speaker 1');
    const speakerB = createSpeaker('Speaker 2');

    return {
      id: createEditorId(),
      type: 'conversation-prompts',
      title: 'Speaking',
      instruction: 'Use the prompts below to interact, respond and continue the conversation.',
      speakerMode: 'pair',
      speakers: [speakerA, speakerB],
      prompts: [],
      exchanges: [
        { id: createEditorId(), speakerId: speakerA.id, text: 'Start the conversation.' },
        { id: createEditorId(), speakerId: speakerB.id, text: 'Answer and add one more idea.' }
      ]
    };
  },
  form: ConversationPromptsForm as BlockFormComponent,
  preview: ConversationPromptsPreview as BlockPreviewComponent,
  normalize: (block) => {
    const fallbackSpeakerA = createSpeaker('Speaker 1');
    const fallbackSpeakerB = createSpeaker('Speaker 2');

    const speakers = Array.isArray(block.speakers)
      ? block.speakers
          .filter((speaker): speaker is Record<string, unknown> =>
            Boolean(speaker && typeof speaker === 'object')
          )
          .map((speaker, index) => ({
            id: typeof speaker.id === 'string' ? speaker.id : createEditorId(),
            name:
              typeof speaker.name === 'string' && speaker.name.trim().length > 0
                ? speaker.name
                : `Speaker ${index + 1}`
          }))
      : [fallbackSpeakerA, fallbackSpeakerB];

    const safeSpeakers =
      speakers.length >= 2 ? speakers.slice(0, 2) : [fallbackSpeakerA, fallbackSpeakerB];
    const prompts = Array.isArray(block.prompts)
      ? block.prompts.filter((prompt): prompt is string => typeof prompt === 'string')
      : [];

    const exchanges = Array.isArray(block.exchanges)
      ? block.exchanges
          .filter((exchange): exchange is Record<string, unknown> =>
            Boolean(exchange && typeof exchange === 'object')
          )
          .map((exchange, index) => ({
            id: typeof exchange.id === 'string' ? exchange.id : createEditorId(),
            speakerId:
              typeof exchange.speakerId === 'string' &&
              safeSpeakers.some((speaker) => speaker.id === exchange.speakerId)
                ? exchange.speakerId
                : safeSpeakers[index % safeSpeakers.length].id,
            text: typeof exchange.text === 'string' ? exchange.text : ''
          }))
      : prompts.map((prompt, index) => ({
          id: createEditorId(),
          speakerId: safeSpeakers[index % safeSpeakers.length].id,
          text: prompt
        }));

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'conversation-prompts',
      title: typeof block.title === 'string' ? block.title : 'Speaking',
      instruction: typeof block.instruction === 'string' ? block.instruction : '',
      speakerMode: block.speakerMode === 'single' ? 'single' : 'pair',
      speakers: safeSpeakers,
      prompts,
      exchanges
    };
  }
};
