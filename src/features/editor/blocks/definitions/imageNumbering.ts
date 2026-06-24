import { Image as ImageIcon } from 'lucide-react';
import { ImageNumberingForm, ImageNumberingPreview } from '../ImageNumberingBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const imageNumberingBlockDefinition: BlockDefinition = {
  type: 'image-numbering',
  label: 'Image Numbering',
  category: 'Practice & Quizzes',
  icon: ImageIcon,
  accent: 'text-yellow-700',
  surface: 'from-yellow-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'image-numbering',
    title: 'Sequence the visuals',
    items: [
      {
        id: createEditorId(),
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300',
        correctNumber: 1,
        label: 'Step label'
      }
    ]
  }),
  form: ImageNumberingForm as BlockFormComponent,
  preview: ImageNumberingPreview as BlockPreviewComponent
};
