import { PenLine } from 'lucide-react';
import { ParagraphForm, ParagraphPreview } from '../ParagraphBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const paragraphBlockDefinition: BlockDefinition = {
  type: 'paragraph',
  label: 'Paragraph',
  category: 'Layout & Theory',
  icon: PenLine,
  accent: 'text-cyan-700',
  surface: 'from-cyan-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'paragraph',
    content: 'Use this area for neutral instructions, context, or brief lesson guidance.',
    style: 'body'
  }),
  form: ParagraphForm as BlockFormComponent,
  preview: ParagraphPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'paragraph',
    content: typeof block.content === 'string' ? block.content : '',
    style:
      block.style === 'body' ||
      block.style === 'intro' ||
      block.style === 'instruction' ||
      block.style === 'note'
        ? block.style
        : 'body'
  })
};
