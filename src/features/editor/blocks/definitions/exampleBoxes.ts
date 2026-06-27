import { Columns2 } from 'lucide-react';
import { ExampleBoxesForm, ExampleBoxesPreview } from '../ExampleBoxesBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const exampleBoxesBlockDefinition: BlockDefinition = {
  type: 'example-boxes',
  label: 'Example Boxes',
  category: 'Layout & Theory',
  icon: Columns2,
  accent: 'text-emerald-700',
  surface: 'from-emerald-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'example-boxes',
    title: 'Examples',
    explanation: 'We use...',
    leftTitle: 'A',
    leftContent: '**A** -> before a consonant sound.\n\na book\na car\na chair',
    rightTitle: 'AN',
    rightContent: '**AN** -> before a vowel sound.\n\nan apple\nan egg\nan umbrella'
  }),
  form: ExampleBoxesForm as BlockFormComponent,
  preview: ExampleBoxesPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'example-boxes',
    title: typeof block.title === 'string' ? block.title : 'Examples',
    explanation: typeof block.explanation === 'string' ? block.explanation : '',
    leftTitle: typeof block.leftTitle === 'string' ? block.leftTitle : '',
    leftContent: typeof block.leftContent === 'string' ? block.leftContent : '',
    rightTitle: typeof block.rightTitle === 'string' ? block.rightTitle : '',
    rightContent: typeof block.rightContent === 'string' ? block.rightContent : ''
  })
};
