import { normalizeSubQuestions } from '../../domain/blockDefaults';
import { History } from 'lucide-react';
import { TimelineForm, TimelinePreview } from '../TimelineBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const timelineBlockDefinition: BlockDefinition = {
  type: 'timeline',
  label: 'Timeline',
  category: 'Layout & Theory',
  icon: History,
  accent: 'text-violet-700',
  surface: 'from-violet-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'timeline',
    title: 'Timeline',
    events: [
      { id: createEditorId(), label: 'Start school', time: '2018' },
      { id: createEditorId(), label: 'Move to a new city', time: '2022' }
    ],
    questions: []
  }),
  form: TimelineForm as BlockFormComponent,
  preview: TimelinePreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'timeline',
    title: typeof block.title === 'string' ? block.title : 'Timeline',
    events: Array.isArray(block.events) ? block.events : [],
    questions: normalizeSubQuestions(block.questions)
  })
};
