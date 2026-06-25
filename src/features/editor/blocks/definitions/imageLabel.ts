import { Tags } from 'lucide-react';
import { ImageLabelForm, ImageLabelPreview } from '../ImageLabelBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createImageLabelItem } from '../../domain/blockDefaults';
import { createEditorId } from '../../domain/ids';

export const imageLabelBlockDefinition: BlockDefinition = {
  type: 'image-label',
  label: 'Image Label',
  category: 'Interactive & Vocab',
  icon: Tags,
  accent: 'text-pink-700',
  surface: 'from-pink-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'image-label',
    title: 'Label the image',
    instruction: 'Look at the image and label each item.',
    imageUrl: '',
    labels: [createImageLabelItem(), createImageLabelItem()]
  }),
  form: ImageLabelForm as BlockFormComponent,
  preview: ImageLabelPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'image-label',
    title: typeof block.title === 'string' ? block.title : 'Label the image',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    imageUrl: typeof block.imageUrl === 'string' ? block.imageUrl : '',
    labels: Array.isArray(block.labels) ? block.labels : [createImageLabelItem()]
  })
};
