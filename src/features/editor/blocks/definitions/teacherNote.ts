import { NotepadText } from 'lucide-react';
import { TeacherNoteForm, TeacherNotePreview } from '../TeacherNoteBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const teacherNoteBlockDefinition: BlockDefinition = {
  type: 'teacher-note',
  label: 'Teacher Note',
  category: 'Layout & Theory',
  icon: NotepadText,
  accent: 'text-amber-700',
  surface: 'from-amber-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'teacher-note',
    audience: 'teacher',
    title: 'Teacher note',
    content: 'Add a short guidance note or tip for the student here.'
  }),
  form: TeacherNoteForm as BlockFormComponent,
  preview: TeacherNotePreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'teacher-note',
    audience: block.audience === 'teacher' || block.audience === 'student' || block.audience === 'both'
      ? block.audience
      : 'teacher',
    title: typeof block.title === 'string' ? block.title : '',
    content: typeof block.content === 'string' ? block.content : ''
  })
};
