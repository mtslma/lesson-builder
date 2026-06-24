import { MessageCircleMore } from 'lucide-react';
import { ConversationPromptsForm, ConversationPromptsPreview } from '../ConversationPromptsBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const conversationPromptsBlockDefinition: BlockDefinition = {
  type: 'conversation-prompts',
  label: 'Discussion Prompts',
  category: 'Production & Speaking',
  icon: MessageCircleMore,
  accent: 'text-sky-700',
  surface: 'from-sky-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'conversation-prompts',
    title: 'Discussion Prompts',
    prompts: ['What is your opinion on the topic?', 'What example can you share?']
  }),
  form: ConversationPromptsForm as BlockFormComponent,
  preview: ConversationPromptsPreview as BlockPreviewComponent
};
