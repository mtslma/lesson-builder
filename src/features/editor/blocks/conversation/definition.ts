import { MessageCircleMore } from 'lucide-react';
import { ConversationForm, ConversationPreview } from '../ConversationBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import { createConversationBlockDefaults, normalizeConversationHighlights } from '../../domain/conversation';

export const conversationBlockDefinition: BlockDefinition = {
  type: 'conversation',
  label: 'Dialogue',
  category: 'Production & Speaking',
  icon: MessageCircleMore,
  accent: 'text-cyan-700',
  surface: 'from-cyan-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'conversation',
    ...createConversationBlockDefaults()
  }),
  form: ConversationForm as BlockFormComponent,
  preview: ConversationPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'conversation',
    imageUrl: typeof block.imageUrl === 'string' ? block.imageUrl : undefined,
    messages: Array.isArray(block.messages)
      ? block.messages.map((message) => ({
          id:
            message && typeof message === 'object' && typeof message.id === 'string'
              ? message.id
              : createEditorId(),
          speaker:
            message && typeof message === 'object' && typeof message.speaker === 'string'
              ? message.speaker
              : '',
          text:
            message && typeof message === 'object' && typeof message.text === 'string'
              ? message.text
              : '',
          highlights: normalizeConversationHighlights(message)
        }))
      : [],
    substitutionBox: Array.isArray(block.substitutionBox)
      ? block.substitutionBox
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((item) => ({
            original: typeof item.original === 'string' ? item.original : '',
            alternatives: Array.isArray(item.alternatives)
              ? item.alternatives.filter((option): option is string => typeof option === 'string')
              : []
          }))
      : undefined
  })
};
