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
    characters: [
      { name: 'Participant A', details: [{ label: 'Role', value: 'Starts the discussion' }] },
      { name: 'Participant B', details: [{ label: 'Role', value: 'Responds to the situation' }] }
    ],
    tips: 'Introduce the scenario and keep the conversation moving naturally.'
  }),
  form: RoleplayForm as BlockFormComponent,
  preview: RoleplayPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'roleplay',
    characters: Array.isArray(block.characters)
      ? block.characters
          .filter((character): character is Record<string, unknown> => Boolean(character && typeof character === 'object'))
          .map((character) => {
            const legacyDetails = [
              ['Country', character.country],
              ['City', character.city],
              ['Activity', character.activity]
            ]
              .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
              .map(([label, value]) => ({
                label: label as string,
                value: value as string
              }));

            return {
              name: typeof character.name === 'string' ? character.name : '',
              details: Array.isArray(character.details)
                ? character.details
                    .filter((detail): detail is Record<string, unknown> => Boolean(detail && typeof detail === 'object'))
                    .map((detail) => ({
                      label: typeof detail.label === 'string' ? detail.label : '',
                      value: typeof detail.value === 'string' ? detail.value : ''
                    }))
                : legacyDetails
            };
          })
      : [],
    tips:
      typeof block.tips === 'string'
        ? block.tips
        : Array.isArray(block.prompts)
          ? block.prompts.filter((prompt): prompt is string => typeof prompt === 'string').join('\n')
          : ''
  })
};
