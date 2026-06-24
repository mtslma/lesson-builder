import { Image as ImageIcon } from 'lucide-react';
import { ImageChoiceForm, ImageChoicePreview } from '../ImageChoiceBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const imageChoiceBlockDefinition: BlockDefinition = {
  type: 'image-choice',
  label: 'Image Choice',
  category: 'Practice & Quizzes',
  icon: ImageIcon,
  accent: 'text-yellow-700',
  surface: 'from-yellow-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'image-choice',
    question: 'Select the image that matches the prompt.',
    options: [
      {
        id: createEditorId(),
        text: 'Option A',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300'
      }
    ]
  }),
  form: ImageChoiceForm as BlockFormComponent,
  preview: ImageChoicePreview as BlockPreviewComponent
};
