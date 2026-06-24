import { CheckCheck } from 'lucide-react';
import { SelectionGridForm, SelectionGridPreview } from '../SelectionGridBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const selectionGridBlockDefinition: BlockDefinition = {
  type: 'selection-grid',
  label: 'Click & Check',
  category: 'Interactive & Vocab',
  icon: CheckCheck,
  accent: 'text-lime-700',
  surface: 'from-lime-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'selection-grid',
    instruction: 'Select the items that match the prompt.',
    isMultiSelect: true,
    items: [
      { id: createEditorId(), text: 'Correct option', isCorrect: true },
      { id: createEditorId(), text: 'Distractor option', isCorrect: false }
    ]
  }),
  form: SelectionGridForm as BlockFormComponent,
  preview: SelectionGridPreview as BlockPreviewComponent
};
