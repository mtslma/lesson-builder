import type { BlockDefinition } from '../../config/blockDefinition';
import { advancedGrammarBlockDefinition } from './advancedGrammar';
import { conversationPromptsBlockDefinition } from './conversationPrompts';
import { conversationBlockDefinition } from '../conversation';
import { calendarClockBlockDefinition } from './calendarClock';
import { fillBlankBlockDefinition } from './fillBlank';
import { finalTaskBlockDefinition } from './finalTask';
import { flashcardsBlockDefinition } from './flashcards';
import { grammarNoteBlockDefinition } from './grammarNote';
import { headingBlockDefinition } from './heading';
import { imageChoiceBlockDefinition } from './imageChoice';
import { imageLabelBlockDefinition } from './imageLabel';
import { imageNumberingBlockDefinition } from './imageNumbering';
import { letterNumberBlockDefinition } from './letterNumber';
import { listeningBlockDefinition } from './listening';
import { mediaBlockDefinition } from './media';
import { miniMapBlockDefinition } from './miniMap';
import { multipleChoiceBlockDefinition } from './multipleChoice';
import { pageBreakBlockDefinition } from './pageBreak';
import { paragraphBlockDefinition } from './paragraph';
import { phrasalVerbFocusBlockDefinition } from './phrasalVerbFocus';
import { questionSetBlockDefinition } from './questionSet';
import { readingComprehensionBlockDefinition } from './readingComprehension';
import { repetitionDrillBlockDefinition } from './repetitionDrill';
import { rewriteQuestionBlockDefinition } from './rewriteQuestion';
import { roleplayBlockDefinition } from './roleplay';
import { selectionGridBlockDefinition } from './selectionGrid';
import { tableCompletionBlockDefinition } from './tableCompletion';
import { teacherNoteBlockDefinition } from './teacherNote';
import { timelineBlockDefinition } from './timeline';
import { vocabularyMatchBlockDefinition } from './vocabularyMatch';
import { wordOrderBlockDefinition } from './wordOrder';
import { writingTaskBlockDefinition } from './writingTask';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  pageBreakBlockDefinition,
  headingBlockDefinition,
  paragraphBlockDefinition,
  letterNumberBlockDefinition,
  teacherNoteBlockDefinition,
  grammarNoteBlockDefinition,
  advancedGrammarBlockDefinition,
  mediaBlockDefinition,
  listeningBlockDefinition,
  readingComprehensionBlockDefinition,
  miniMapBlockDefinition,
  calendarClockBlockDefinition,
  vocabularyMatchBlockDefinition,
  selectionGridBlockDefinition,
  phrasalVerbFocusBlockDefinition,
  repetitionDrillBlockDefinition,
  fillBlankBlockDefinition,
  questionSetBlockDefinition,
  wordOrderBlockDefinition,
  tableCompletionBlockDefinition,
  multipleChoiceBlockDefinition,
  rewriteQuestionBlockDefinition,
  imageChoiceBlockDefinition,
  imageLabelBlockDefinition,
  imageNumberingBlockDefinition,
  conversationBlockDefinition,
  conversationPromptsBlockDefinition,
  roleplayBlockDefinition,
  writingTaskBlockDefinition,
  timelineBlockDefinition,
  finalTaskBlockDefinition,
  flashcardsBlockDefinition
];
