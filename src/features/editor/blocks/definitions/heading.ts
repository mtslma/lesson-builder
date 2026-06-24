import { NotepadText } from 'lucide-react';
import { HeadingForm, HeadingPreview } from '../HeadingBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const headingBlockDefinition: BlockDefinition = {
  type: 'heading',
  label: 'Heading',
  category: 'Layout & Theory',
  icon: NotepadText,
  accent: 'text-sky-700',
  surface: 'from-sky-100 to-white',
  create: () => ({ id: createEditorId(), type: 'heading', content: 'Learning Focus', level: 'h2' }),
  form: HeadingForm as BlockFormComponent,
  preview: HeadingPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'heading',
    content: typeof block.content === 'string' ? block.content : '',
    level:
      block.level === 'h1' || block.level === 'h2' || block.level === 'h3' || block.level === 'h4'
        ? block.level
        : 'h2'
  })
};
