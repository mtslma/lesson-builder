import { Map } from 'lucide-react';
import { MiniMapForm, MiniMapPreview } from '../MiniMapBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import { createSubQuestion, normalizeSubQuestions } from '../../domain/blockDefaults';

export const miniMapBlockDefinition: BlockDefinition = {
  type: 'mini-map',
  label: 'Mini Map / Scene',
  category: 'Reading & Media',
  icon: Map,
  accent: 'text-lime-700',
  surface: 'from-lime-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'mini-map',
    title: 'Map Activity',
    instruction: 'Look at the map and answer the questions.',
    imageUrl: '',
    markers: [
      { id: createEditorId(), label: 'Bank', clue: 'Next to the park' },
      { id: createEditorId(), label: 'School', clue: 'Across from the library' }
    ],
    questions: [createSubQuestion('short-answer', 'Where is the bank?')]
  }),
  form: MiniMapForm as BlockFormComponent,
  preview: MiniMapPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'mini-map',
    title: typeof block.title === 'string' ? block.title : 'Map Activity',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    imageUrl: typeof block.imageUrl === 'string' ? block.imageUrl : '',
    markers: Array.isArray(block.markers) ? block.markers : [],
    questions: normalizeSubQuestions(block.questions)
  })
};
