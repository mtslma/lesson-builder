import type { BlockDefinition } from '../../config/blockDefinition';
import { advancedGrammarBlockDefinition } from './advancedGrammar';
import { conversationPromptsBlockDefinition } from './conversationPrompts';
import { conversationBlockDefinition } from '../conversation';
import { fillBlankBlockDefinition } from './fillBlank';
import { finalTaskBlockDefinition } from './finalTask';
import { flashcardsBlockDefinition } from './flashcards';
import { grammarNoteBlockDefinition } from './grammarNote';
import { headingBlockDefinition } from './heading';
import { imageChoiceBlockDefinition } from './imageChoice';
import { imageNumberingBlockDefinition } from './imageNumbering';
import { listeningBlockDefinition } from './listening';
import { mediaBlockDefinition } from './media';
import { multipleChoiceBlockDefinition } from './multipleChoice';
import { pageBreakBlockDefinition } from './pageBreak';
import { paragraphBlockDefinition } from './paragraph';
import { phrasalVerbFocusBlockDefinition } from './phrasalVerbFocus';
import { readingComprehensionBlockDefinition } from './readingComprehension';
import { repetitionDrillBlockDefinition } from './repetitionDrill';
import { rewriteQuestionBlockDefinition } from './rewriteQuestion';
import { roleplayBlockDefinition } from './roleplay';
import { selectionGridBlockDefinition } from './selectionGrid';
import { teacherNoteBlockDefinition } from './teacherNote';
import { vocabularyMatchBlockDefinition } from './vocabularyMatch';
import { writingTaskBlockDefinition } from './writingTask';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  pageBreakBlockDefinition,
  headingBlockDefinition,
  paragraphBlockDefinition,
  teacherNoteBlockDefinition,
  grammarNoteBlockDefinition,
  advancedGrammarBlockDefinition,
  mediaBlockDefinition,
  listeningBlockDefinition,
  readingComprehensionBlockDefinition,
  vocabularyMatchBlockDefinition,
  selectionGridBlockDefinition,
  phrasalVerbFocusBlockDefinition,
  repetitionDrillBlockDefinition,
  fillBlankBlockDefinition,
  multipleChoiceBlockDefinition,
  rewriteQuestionBlockDefinition,
  imageChoiceBlockDefinition,
  imageNumberingBlockDefinition,
  conversationBlockDefinition,
  conversationPromptsBlockDefinition,
  roleplayBlockDefinition,
  writingTaskBlockDefinition,
  finalTaskBlockDefinition,
  flashcardsBlockDefinition
];
