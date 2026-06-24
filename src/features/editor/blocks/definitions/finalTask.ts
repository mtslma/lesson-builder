import { ClipboardList } from 'lucide-react';
import { FinalTaskForm, FinalTaskPreview } from '../FinalTaskBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const finalTaskBlockDefinition: BlockDefinition = {
  type: 'final-task',
  label: 'Final Profile Task',
  category: 'Production & Speaking',
  icon: ClipboardList,
  accent: 'text-neutral-700',
  surface: 'from-neutral-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'final-task',
    title: 'Final Task',
    fields: ['Name', 'Response', 'Reflection']
  }),
  form: FinalTaskForm as BlockFormComponent,
  preview: FinalTaskPreview as BlockPreviewComponent
};
