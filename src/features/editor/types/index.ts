export type QuestionType = 'multiple-choice' | 'true-false' | 'open-ended';

export interface SubQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Para A, B, C, D...
  answer?: string;
}

export type BlockType =
  | 'page-break'
  | 'heading'
  | 'paragraph'
  | 'grammar-note'
  | 'advanced-grammar'
  | 'media-block'
  | 'listening'
  | 'reading-comprehension'
  | 'conversation'
  | 'flashcards'
  | 'vocabulary-match'
  | 'image-numbering'
  | 'selection-grid'
  | 'image-choice'
  | 'fill-blank'
  | 'multiple-choice'
  | 'rewrite-question'
  | 'repetition-drill'
  | 'phrasal-verb-focus'
  | 'roleplay'
  | 'conversation-prompts'
  | 'writing-task'
  | 'final-task';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break';
  pageNumber: number;
  estimatedTime: string;
}
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;
}
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}
export interface GrammarNoteBlock extends BaseBlock {
  type: 'grammar-note';
  title: string;
  ruleContext: string;
  expandableTitle: string;
  expandableContent: string;
}

export interface AdvancedGrammarBlock extends BaseBlock {
  type: 'advanced-grammar';
  title: string;
  explanation: string;
  tableHeaders: string[];
  tableRows: { elements: string[] }[];
}

export interface MediaBlock extends BaseBlock {
  type: 'media-block';
  url: string;
  numbering?: string;
  position: 'left' | 'center' | 'right';
}

export interface ListeningBlock extends BaseBlock {
  type: 'listening';
  audioUrl: string;
  maxPlays?: number;
  contextImageUrl?: string;
  questions: SubQuestion[];
}

export interface ReadingComprehensionBlock extends BaseBlock {
  type: 'reading-comprehension';
  title: string;
  text: string;
  questions: SubQuestion[];
}

export interface ConversationBlock extends BaseBlock {
  type: 'conversation';
  imageUrl?: string;
  messages: { speaker: string; text: string; highlighted?: boolean }[];
  substitutionBox?: { original: string; alternatives: string[] }[];
}
export interface FlashcardsBlock extends BaseBlock {
  type: 'flashcards';
  title: string;
  cards: { id: string; frontText?: string; frontImage?: string; backText: string }[];
}
export interface VocabularyMatchBlock extends BaseBlock {
  type: 'vocabulary-match';
  title: string;
  pairs: { left: string; leftType: 'text' | 'image'; right: string }[];
}
export interface ImageNumberingBlock extends BaseBlock {
  type: 'image-numbering';
  title: string;
  items: { id: string; imageUrl: string; correctNumber: number; label: string }[];
}
export interface SelectionGridBlock extends BaseBlock {
  type: 'selection-grid';
  instruction: string;
  isMultiSelect: boolean;
  items: { id: string; text: string; imageUrl?: string; isCorrect?: boolean }[];
}
export interface ImageChoiceBlock extends BaseBlock {
  type: 'image-choice';
  question: string;
  options: { id: string; text: string; imageUrl?: string }[];
}
export interface FillBlankBlock extends BaseBlock {
  type: 'fill-blank';
  instruction?: string;
  textWithGaps: string;
  supportWords?: string[];
}
export interface MultipleChoiceBlock extends BaseBlock {
  type: 'multiple-choice';
  question: string;
  options: { id: string; text: string; isCorrect?: boolean }[];
}
export interface RewriteQuestionBlock extends BaseBlock {
  type: 'rewrite-question';
  instruction: string;
  examples?: { input: string; output: string }[];
  items: string[];
}

export interface RepetitionDrillBlock extends BaseBlock {
  type: 'repetition-drill';
  title: string;
  words: { word: string; phonetic?: string; translation?: string }[];
}

export interface PhrasalVerbFocusBlock extends BaseBlock {
  type: 'phrasal-verb-focus';
  verb: string;
  meaning: string;
  examples: string[];
}

export interface RoleplayBlock extends BaseBlock {
  type: 'roleplay';
  characters: { name: string; country?: string; city?: string; activity?: string }[];
  prompts: string[];
}

export interface ConversationPromptsBlock extends BaseBlock {
  type: 'conversation-prompts';
  title: string;
  prompts: string[];
}

export interface WritingTaskBlock extends BaseBlock {
  type: 'writing-task';
  title: string;
  prompt: string;
  minWords?: number;
}
export interface FinalTaskBlock extends BaseBlock {
  type: 'final-task';
  title: string;
  fields: string[];
}

export type LessonBlock =
  | PageBreakBlock
  | HeadingBlock
  | ParagraphBlock
  | GrammarNoteBlock
  | AdvancedGrammarBlock
  | MediaBlock
  | ListeningBlock
  | ReadingComprehensionBlock
  | ConversationBlock
  | FlashcardsBlock
  | VocabularyMatchBlock
  | ImageNumberingBlock
  | SelectionGridBlock
  | ImageChoiceBlock
  | FillBlankBlock
  | MultipleChoiceBlock
  | RewriteQuestionBlock
  | RepetitionDrillBlock
  | PhrasalVerbFocusBlock
  | RoleplayBlock
  | ConversationPromptsBlock
  | WritingTaskBlock
  | FinalTaskBlock;

export interface Lesson {
  id: string;
  title: string;
  level: string;
  language: string;
  blocks: LessonBlock[];
}
