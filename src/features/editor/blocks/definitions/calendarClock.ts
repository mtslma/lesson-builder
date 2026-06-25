import { Clock3 } from 'lucide-react';
import { CalendarClockForm, CalendarClockPreview } from '../CalendarClockBlock';
import type { BlockDefinition, BlockFormComponent, BlockPreviewComponent } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';
import { createSubQuestion, normalizeSubQuestions } from '../../domain/blockDefaults';

export const calendarClockBlockDefinition: BlockDefinition = {
  type: 'calendar-clock',
  label: 'Calendar / Clock',
  category: 'Reading & Media',
  icon: Clock3,
  accent: 'text-cyan-700',
  surface: 'from-cyan-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'calendar-clock',
    title: 'Dates and time',
    instruction: 'Use the calendar and clock information to answer the questions.',
    calendarNotes: ['Monday: English class', 'Friday: Birthday party'],
    clockTimes: ['07:30', '12:15', '18:45'],
    questions: [createSubQuestion('short-answer', 'What time is the English class?')]
  }),
  form: CalendarClockForm as BlockFormComponent,
  preview: CalendarClockPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'calendar-clock',
    title: typeof block.title === 'string' ? block.title : 'Dates and time',
    instruction: typeof block.instruction === 'string' ? block.instruction : '',
    calendarNotes: Array.isArray(block.calendarNotes) ? block.calendarNotes : [],
    clockTimes: Array.isArray(block.clockTimes) ? block.clockTimes : [],
    questions: normalizeSubQuestions(block.questions)
  })
};
