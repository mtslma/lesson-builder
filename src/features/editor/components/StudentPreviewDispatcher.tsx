import React from 'react';
import type { LessonBlock } from '../types/index';
import { HeadingPreview, ParagraphPreview } from '../modules/LayoutModule';
import { GrammarNotePreview, AdvancedGrammarPreview } from '../modules/GrammarModule';
import {
  MediaPreview,
  ListeningPreview,
  ReadingComprehensionPreview
} from '../modules/MediaModule';
import {
  VocabularyMatchPreview,
  FlashcardsPreview,
  RepetitionDrillPreview,
  PhrasalVerbPreview
} from '../modules/VocabModule';
import {
  FillBlankPreview,
  SelectionGridPreview,
  MultipleChoicePreview,
  ImageChoicePreview,
  RewriteQuestionPreview,
  ImageNumberingPreview
} from '../modules/QuizModule';
import {
  ConversationPreview,
  ConversationPromptsPreview,
  RoleplayPreview,
  TeacherNotePreview,
  WritingTaskPreview,
  FinalTaskPreview
} from '../modules/ProductionModule';

export const StudentPreviewDispatcher: React.FC<{ block: LessonBlock }> = ({ block }) => {
  const props = { block };
  switch (block.type) {
    case 'heading':
      return <HeadingPreview {...props} />;
    case 'paragraph':
      return <ParagraphPreview {...props} />;
    case 'teacher-note':
      return <TeacherNotePreview {...props} />;
    case 'grammar-note':
      return <GrammarNotePreview {...props} />;
    case 'advanced-grammar':
      return <AdvancedGrammarPreview {...props} />;
    case 'media-block':
      return <MediaPreview {...props} />;
    case 'reading-comprehension':
      return <ReadingComprehensionPreview {...props} />;
    case 'listening':
      return <ListeningPreview {...props} />;
    case 'conversation':
      return <ConversationPreview {...props} />;
    case 'flashcards':
      return <FlashcardsPreview {...props} />;
    case 'repetition-drill':
      return <RepetitionDrillPreview {...props} />;
    case 'phrasal-verb-focus':
      return <PhrasalVerbPreview {...props} />;
    case 'conversation-prompts':
      return <ConversationPromptsPreview {...props} />;
    case 'fill-blank':
      return <FillBlankPreview {...props} />;
    case 'selection-grid':
      return <SelectionGridPreview {...props} />;
    case 'vocabulary-match':
      return <VocabularyMatchPreview {...props} />;
    case 'image-choice':
      return <ImageChoicePreview {...props} />;
    case 'multiple-choice':
      return <MultipleChoicePreview {...props} />;
    case 'rewrite-question':
      return <RewriteQuestionPreview {...props} />;
    case 'roleplay':
      return <RoleplayPreview {...props} />;
    case 'writing-task':
      return <WritingTaskPreview {...props} />;
    case 'final-task':
      return <FinalTaskPreview {...props} />;
    case 'image-numbering':
      return <ImageNumberingPreview {...props} />;
    default:
      return (
        <div className="my-4 p-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50 font-mono">
          [{block.type}] visual renderer pending.
        </div>
      );
  }
};
