import { ClipboardList } from 'lucide-react';
import { RoleplayForm, RoleplayPreview } from '../RoleplayBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const roleplayBlockDefinition: BlockDefinition = {
  type: 'roleplay',
  label: 'Roleplay Cards',
  category: 'Production & Speaking',
  icon: ClipboardList,
  accent: 'text-red-700',
  surface: 'from-red-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'roleplay',
    title: 'Roleplay',
    objective: 'Complete the speaking task with your partner.',
    customFields: [],
    characters: [],
    tips: ''
  }),
  form: RoleplayForm as BlockFormComponent,
  preview: RoleplayPreview as BlockPreviewComponent,
  normalize: (block) => {
    const customFields =
      Array.isArray(block.customFields)
      ? block.customFields
          .filter((field): field is Record<string, unknown> => Boolean(field && typeof field === 'object'))
          .map((field) => ({
            id: typeof field.id === 'string' ? field.id : createEditorId(),
            label: typeof field.label === 'string' ? field.label : '',
            value: typeof field.value === 'string' ? field.value : ''
          }))
      : (() => {
          const fallbackFields: { id: string; label: string; value: string }[] = [];

          if (typeof block.scenario === 'string' && block.scenario.trim()) {
            fallbackFields.push({ id: createEditorId(), label: 'Scenario', value: block.scenario });
          }

          if (typeof block.studentACard === 'string' && block.studentACard.trim()) {
            fallbackFields.push({ id: createEditorId(), label: 'Student A', value: block.studentACard });
          }

          if (typeof block.studentBCard === 'string' && block.studentBCard.trim()) {
            fallbackFields.push({ id: createEditorId(), label: 'Student B', value: block.studentBCard });
          }

          if (Array.isArray(block.usefulPhrases) && block.usefulPhrases.length > 0) {
            fallbackFields.push({
              id: createEditorId(),
              label: 'Useful phrases',
              value: block.usefulPhrases.join('\n')
            });
          }

          if (Array.isArray(block.vocabularySupport) && block.vocabularySupport.length > 0) {
            fallbackFields.push({
              id: createEditorId(),
              label: 'Vocabulary support',
              value: block.vocabularySupport.join('\n')
            });
          }

          if (typeof block.teacherNotes === 'string' && block.teacherNotes.trim()) {
            fallbackFields.push({
              id: createEditorId(),
              label: 'Teacher notes',
              value: block.teacherNotes
            });
          }

          if (typeof block.timerMinutes === 'number') {
            fallbackFields.push({
              id: createEditorId(),
              label: 'Timer',
              value: `${block.timerMinutes} min`
            });
          }

          return fallbackFields;
        })();

    return {
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'roleplay',
      title: typeof block.title === 'string' ? block.title : 'Roleplay',
      objective: typeof block.objective === 'string' ? block.objective : '',
      customFields,
      scenario: typeof block.scenario === 'string' ? block.scenario : undefined,
      studentACard: typeof block.studentACard === 'string' ? block.studentACard : undefined,
      studentBCard: typeof block.studentBCard === 'string' ? block.studentBCard : undefined,
      usefulPhrases: Array.isArray(block.usefulPhrases)
        ? block.usefulPhrases.filter((item): item is string => typeof item === 'string')
        : [],
      vocabularySupport: Array.isArray(block.vocabularySupport)
        ? block.vocabularySupport.filter((item): item is string => typeof item === 'string')
        : [],
      teacherNotes: typeof block.teacherNotes === 'string' ? block.teacherNotes : '',
      timerMinutes: typeof block.timerMinutes === 'number' ? block.timerMinutes : undefined,
      characters: Array.isArray(block.characters) ? block.characters : [],
      tips: typeof block.tips === 'string' ? block.tips : ''
    };
  }
};
