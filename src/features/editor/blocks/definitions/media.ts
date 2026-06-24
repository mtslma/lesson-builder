import { Image as ImageIcon } from 'lucide-react';
import { MediaForm, MediaPreview } from '../MediaAssetBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const mediaBlockDefinition: BlockDefinition = {
  type: 'media-block',
  label: 'Image/Media',
  category: 'Reading & Media',
  icon: ImageIcon,
  accent: 'text-amber-700',
  surface: 'from-amber-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'media-block',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900',
    position: 'center',
    numbering: 'Visual reference'
  }),
  form: MediaForm as BlockFormComponent,
  preview: MediaPreview as BlockPreviewComponent
};
