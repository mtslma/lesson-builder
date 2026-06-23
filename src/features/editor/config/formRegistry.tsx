import React from 'react';
import type { LessonBlock } from '../types/index';
import { HeadingForm, ParagraphForm } from '../modules/LayoutModule';
import { GrammarNoteForm, AdvancedGrammarForm } from '../modules/GrammarModule';
import { MediaForm, ListeningForm, ReadingComprehensionForm } from '../modules/MediaModule';
import {
  VocabularyMatchForm,
  FlashcardsForm,
  RepetitionDrillForm,
  PhrasalVerbForm
} from '../modules/VocabModule';
import {
  FillBlankForm,
  SelectionGridForm,
  MultipleChoiceForm,
  ImageChoiceForm,
  RewriteQuestionForm,
  ImageNumberingForm
} from '../modules/QuizModule';
import {
  ConversationForm,
  ConversationPromptsForm,
  RoleplayForm,
  TeacherNoteForm,
  WritingTaskForm,
  FinalTaskForm
} from '../modules/ProductionModule';

type BlockFormComponent = React.ComponentType<{
  block: LessonBlock;
  onUpdate: (fields: Partial<LessonBlock>) => void;
}>;

export const blockFormRegistry: Partial<Record<LessonBlock['type'], BlockFormComponent>> = {
  heading: HeadingForm as BlockFormComponent,
  paragraph: ParagraphForm as BlockFormComponent,
  'teacher-note': TeacherNoteForm as BlockFormComponent,
  'grammar-note': GrammarNoteForm as BlockFormComponent,
  'advanced-grammar': AdvancedGrammarForm as BlockFormComponent,
  'media-block': MediaForm as BlockFormComponent,
  listening: ListeningForm as BlockFormComponent,
  'reading-comprehension': ReadingComprehensionForm as BlockFormComponent,
  flashcards: FlashcardsForm as BlockFormComponent,
  'vocabulary-match': VocabularyMatchForm as BlockFormComponent,
  'image-numbering': ImageNumberingForm as BlockFormComponent,
  'phrasal-verb-focus': PhrasalVerbForm as BlockFormComponent,
  'repetition-drill': RepetitionDrillForm as BlockFormComponent,
  'selection-grid': SelectionGridForm as BlockFormComponent,
  'image-choice': ImageChoiceForm as BlockFormComponent,
  'fill-blank': FillBlankForm as BlockFormComponent,
  'multiple-choice': MultipleChoiceForm as BlockFormComponent,
  'rewrite-question': RewriteQuestionForm as BlockFormComponent,
  conversation: ConversationForm as BlockFormComponent,
  roleplay: RoleplayForm as BlockFormComponent,
  'conversation-prompts': ConversationPromptsForm as BlockFormComponent,
  'writing-task': WritingTaskForm as BlockFormComponent,
  'final-task': FinalTaskForm as BlockFormComponent
};
