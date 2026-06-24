import { Sparkles } from 'lucide-react';
import { GrammarNoteForm, GrammarNotePreview } from '../GrammarNoteBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const grammarNoteBlockDefinition: BlockDefinition = {
  type: 'grammar-note',
  label: 'Simple Grammar',
  category: 'Layout & Theory',
  icon: Sparkles,
  accent: 'text-blue-700',
  surface: 'from-blue-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'grammar-note',
    title: 'Grammar Note',
    ruleContext: 'Add a short and neutral explanation of the language pattern here.',
    expandableTitle: 'See model examples',
    expandableContent: 'Example 1\nExample 2'
  }),
  form: GrammarNoteForm as BlockFormComponent,
  preview: GrammarNotePreview as BlockPreviewComponent
};
