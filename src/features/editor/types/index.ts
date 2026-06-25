export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'open-ended'
  | 'short-answer'
  | 'checkbox'
  | 'fill-in-the-blank'
  | 'matching'
  | 'ordering'
  | 'correct-false'
  | 'table-completion'
  | 'image-choice'
  | 'find-in-text';
export type BlockAudience = 'student' | 'teacher' | 'both';
export type LessonDocumentType = 'lesson-authoring' | 'lesson-public';

export interface LessonMeta {
  slug: string;
  createdAt: string;
  updatedAt: string;
  editorVersion: string;
  sourceLessonId?: string;
  sourceFormatVersion?: number;
}

export interface ConversationHighlight {
  id: string;
  text: string;
  color: string;
  kind?: 'grammar' | 'vocabulary' | 'phrasal-verb' | 'custom';
  note?: string;
}

export interface MediaAsset {
  url: string;
  caption?: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  meaning: string;
}

export interface SharedQuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  matchKey?: string;
}

export interface SharedQuestionTable {
  headers: string[];
  rows: {
    id: string;
    cells: string[];
  }[];
}

export interface SharedQuestionGap {
  id: string;
}

export interface SubQuestion {
  id: string;
  type: QuestionType;
  question: string;
  instructions?: string;
  columns?: 1 | 2;
  mode?: 'typing' | 'dropdown';
  options?: SharedQuestionOption[];
  answer?: string;
  acceptedAnswers?: string[];
  correctOptionIds?: string[];
  allowMultiple?: boolean;
  wordSuggestions?: string[];
  pairs?: { id: string; left: string; right: string }[];
  sequence?: string[];
  gaps?: SharedQuestionGap[];
  table?: SharedQuestionTable;
  feedback?: string;
}

export type BlockType =
  | 'page-break'
  | 'heading'
  | 'paragraph'
  | 'letter-number'
  | 'teacher-note'
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
  | 'question-set'
  | 'word-order'
  | 'table-completion'
  | 'image-label'
  | 'mini-map'
  | 'timeline'
  | 'calendar-clock'
  | 'final-task';

export interface BaseBlock {
  id: string;
  type: BlockType;
  audience?: BlockAudience;
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break';
  pageNumber: number;
  estimatedTime: string;
}
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
}
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
  style?: 'body' | 'intro' | 'instruction' | 'note';
}
export interface LetterNumberBlock extends BaseBlock {
  type: 'letter-number';
  title: string;
  instruction?: string;
  variant?: 'letters' | 'numbers' | 'mixed';
  density?: 'compact' | 'regular';
  itemsPerRow?: number;
  items: {
    id: string;
    symbol: string;
    label?: string;
  }[];
}
export interface TeacherNoteBlock extends BaseBlock {
  type: 'teacher-note';
  title: string;
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
  details?: string;
  structureTitle?: string;
  structureTableHeaders: string[];
  structureTableRows: { cells: { text: string; highlights: ConversationHighlight[] }[] }[];
  examples: string[];
  commonMistakes: string[];
  comparisons: { id: string; label: string; detail: string }[];
  miniPractice: string[];
  tableHeaders: string[];
  tableRows: { cells: { text: string; highlights: ConversationHighlight[] }[] }[];
}

export interface MediaBlock extends BaseBlock {
  type: 'media-block';
  url: string;
  numbering?: string;
  position: 'left' | 'center' | 'right';
}

export interface ConversationMessage {
  id: string;
  speaker: string;
  text: string;
  highlights: ConversationHighlight[];
  avatarUrl?: string;
  audioUrl?: string;
}

export interface ListeningBlock extends BaseBlock {
  type: 'listening';
  title?: string;
  instruction?: string;
  audioUrl: string;
  contextImageUrl?: string;
  script?: ConversationMessage[];
  transcriptVisibility?: 'hidden' | 'after-answer' | 'always';
  questions: SubQuestion[];
}

export interface ReadingComprehensionBlock extends BaseBlock {
  type: 'reading-comprehension';
  title: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  textHighlights?: ConversationHighlight[];
  glossaryItems?: GlossaryItem[];
  discussionQuestions?: string[];
  questions: SubQuestion[];
}

export interface ConversationSubstitution {
  original: string;
  alternatives: string[];
}

export interface ConversationBlock extends BaseBlock {
  type: 'conversation';
  title?: string;
  instruction?: string;
  imageUrl?: string;
  layout?: 'script' | 'chat' | 'cards' | 'classroom';
  messages: ConversationMessage[];
  substitutionBox?: ConversationSubstitution[];
}

export interface FlashcardsBlock extends BaseBlock {
  type: 'flashcards';
  title: string;
  category?: string;
  tags?: string[];
  variant?: 'grid' | 'list' | 'carousel' | 'study';
  cards: {
    id: string;
    expressions: string[];
    frontImage?: string;
    backText: string;
    backImage?: string;
    imageFit?: 'cover' | 'contain';
    imagePositionX?: number;
    imagePositionY?: number;
    imageZoom?: number;
    audioUrl?: string;
    exampleSentence?: string;
    translation?: string;
    shortMeaning?: string;
    category?: string;
    tags?: string[];
  }[];
}
export interface VocabularyMatchBlock extends BaseBlock {
  type: 'vocabulary-match';
  title: string;
  variant?: 'classic' | 'cards' | 'two-column';
  matchMode?:
    | 'text-to-text'
    | 'image-to-word'
    | 'audio-to-word'
    | 'word-to-meaning'
    | 'phrase-to-response'
    | 'category-matching';
  instruction?: string;
  shuffleLeft?: boolean;
  shuffleRight?: boolean;
  showReferenceBadges?: boolean;
  showCorrectMatches?: boolean;
  pairs: {
    id: string;
    left: string;
    leftType: 'text' | 'image' | 'audio' | 'category';
    leftLabel?: string;
    right: string;
    rightType?: 'text' | 'image' | 'audio' | 'category';
    rightLabel?: string;
  }[];
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
  text: string;
  columns?: 1 | 2;
  mode?: 'typing' | 'dropdown';
  gaps: {
    id: string;
    acceptedAnswers: string[];
    suggestions?: string[];
    hint?: string;
    caseSensitive: boolean;
  }[];
}
export interface MultipleChoiceBlock extends BaseBlock {
  type: 'multiple-choice';
  question: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
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
  title?: string;
  items: {
    id: string;
    verb: string;
    meaning: string;
    examples: string[];
  }[];
  verb?: string;
  meaning?: string;
  examples?: string[];
}

export interface RoleplayBlock extends BaseBlock {
  type: 'roleplay';
  title?: string;
  objective: string;
  customFields: { id: string; label: string; value: string }[];
  scenario?: string;
  studentACard?: string;
  studentBCard?: string;
  usefulPhrases?: string[];
  vocabularySupport?: string[];
  teacherNotes?: string;
  timerMinutes?: number;
  characters: { name: string; details: { label: string; value: string }[] }[];
  tips: string;
}

export interface ConversationPromptsBlock extends BaseBlock {
  type: 'conversation-prompts';
  title: string;
  instruction?: string;
  speakers: { id: string; name: string }[];
  speakerMode?: 'single' | 'pair';
  prompts: string[];
  exchanges: { id: string; speakerId: string; text: string }[];
}

export interface WritingTaskBlock extends BaseBlock {
  type: 'writing-task';
  title: string;
  prompt: string;
  sentenceStarters?: string[];
  suggestedVocabulary?: string[];
  grammarReminder?: string;
  checklist?: string[];
  minWords?: number;
  rubric?: string;
}

export interface QuestionSetBlock extends BaseBlock {
  type: 'question-set';
  title: string;
  instruction: string;
  questions: SubQuestion[];
}

export interface WordOrderBlock extends BaseBlock {
  type: 'word-order';
  title: string;
  instruction: string;
  items: { id: string; prompt: string; sequence: string[] }[];
}

export interface TableCompletionBlock extends BaseBlock {
  type: 'table-completion';
  title: string;
  instruction: string;
  headers: string[];
  rows: { id: string; cells: string[] }[];
  questions?: SubQuestion[];
}

export interface ImageLabelBlock extends BaseBlock {
  type: 'image-label';
  title: string;
  instruction: string;
  imageUrl: string;
  labels: { id: string; prompt: string; answer: string }[];
}

export interface MiniMapBlock extends BaseBlock {
  type: 'mini-map';
  title: string;
  instruction: string;
  imageUrl: string;
  markers: { id: string; label: string; clue?: string }[];
  questions: SubQuestion[];
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  title: string;
  events: { id: string; label: string; time: string }[];
  questions?: SubQuestion[];
}

export interface CalendarClockBlock extends BaseBlock {
  type: 'calendar-clock';
  title: string;
  instruction: string;
  calendarNotes: string[];
  clockTimes: string[];
  questions: SubQuestion[];
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
  | LetterNumberBlock
  | TeacherNoteBlock
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
  | QuestionSetBlock
  | WordOrderBlock
  | TableCompletionBlock
  | ImageLabelBlock
  | MiniMapBlock
  | TimelineBlock
  | CalendarClockBlock
  | FinalTaskBlock;

export type BlockByType<T extends BlockType> = Extract<LessonBlock, { type: T }>;

export interface BlockFormProps<T extends LessonBlock> {
  block: T;
  onUpdate: (changes: Partial<T>) => void;
}

export interface BlockPreviewProps<T extends LessonBlock> {
  block: T;
}

export interface Lesson {
  documentType: 'lesson-authoring';
  formatVersion: 2;
  schemaVersion: 1;
  id: string;
  title: string;
  level: string;
  language: string;
  meta: LessonMeta;
  blocks: LessonBlock[];
}

export interface PublicLesson {
  documentType: 'lesson-public';
  formatVersion: 2;
  schemaVersion: 1;
  id: string;
  title: string;
  level: string;
  language: string;
  meta: LessonMeta;
  blocks: unknown[];
}
