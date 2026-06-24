import { SquarePen } from 'lucide-react';
import { FillBlankForm, FillBlankPreview } from '../FillBlankBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const fillBlankBlockDefinition: BlockDefinition = {
  type: 'fill-blank',
  label: 'Inline Gaps',
  category: 'Practice & Quizzes',
  icon: SquarePen,
  accent: 'text-teal-700',
  surface: 'from-teal-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'fill-blank',
    instruction: 'Complete the sentence with the best option.',
    text: 'This is a [] sentence for practice.',
    columns: 1,
    gaps: [{ id: 'gap1', acceptedAnswers: ['sample'], suggestions: ['sample'], caseSensitive: false }]
  }),
  form: FillBlankForm as BlockFormComponent,
  preview: FillBlankPreview as BlockPreviewComponent,
  normalize: (block) => {
    const normalizedText =
      typeof block.text === 'string' ? block.text.replace(/\{\{[^}]+\}\}/g, '[]') : '';

    const placeholderCount = (normalizedText.match(/\[\]/g) || []).length;
    const rawGaps = Array.isArray(block.gaps)
      ? block.gaps.filter((gap): gap is Record<string, unknown> => Boolean(gap && typeof gap === 'object'))
      : [];

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'fill-blank',
      instruction: typeof block.instruction === 'string' ? block.instruction : '',
      text: normalizedText,
      columns: block.columns === 2 ? 2 : 1,
      gaps: Array.from({ length: placeholderCount }, (_, index) => {
        const gap = rawGaps[index];

        return {
          id: gap && typeof gap.id === 'string' ? gap.id : `gap${index + 1}`,
          acceptedAnswers:
            gap && Array.isArray(gap.acceptedAnswers)
              ? gap.acceptedAnswers.filter((answer): answer is string => typeof answer === 'string')
              : [''],
          suggestions:
            gap && Array.isArray(gap.suggestions)
              ? gap.suggestions.filter((suggestion): suggestion is string => typeof suggestion === 'string')
              : undefined,
          caseSensitive: gap && typeof gap.caseSensitive === 'boolean' ? gap.caseSensitive : false
        };
      })
    };
  }
};
