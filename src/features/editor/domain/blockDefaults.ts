import type {
  FlashcardsBlock,
  ImageChoiceBlock,
  ImageLabelBlock,
  ImageNumberingBlock,
  MultipleChoiceBlock,
  PhrasalVerbFocusBlock,
  QuestionBuilderItem,
  QuestionSetBlock,
  SelectionGridBlock,
  SharedQuestionGap,
  SharedQuestionOption,
  SharedQuestionTable,
  SubQuestion,
  TableCompletionBlock,
  VocabularyMatchBlock,
  WordOrderBlock
} from '../types/index';
import { createEditorId } from './ids';

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export const createQuestionOption = (text = ''): SharedQuestionOption => ({
  id: createEditorId(),
  text
});

export const createQuestionGap = (): SharedQuestionGap => ({
  id: createEditorId()
});

export const createQuestionTable = (): SharedQuestionTable => ({
  headers: ['Column 1', 'Column 2'],
  rows: [
    { id: createEditorId(), cells: ['Row 1', ''] },
    { id: createEditorId(), cells: ['Row 2', ''] }
  ]
});

export const createSubQuestion = (
  type: SubQuestion['type'] = 'multiple-choice',
  question = '',
  legacyOptions?: string[]
): SubQuestion => {
  const base: SubQuestion = {
    id: createEditorId(),
    type,
    question
  };

  switch (type) {
    case 'multiple-choice':
      return {
        ...base,
        options: (legacyOptions || ['Option A', 'Option B']).map(createQuestionOption)
      };
    case 'audio-missing-word':
      return {
        ...base,
        instructions: 'Choose the missing word you hear.',
        options: (legacyOptions || ['Option A', 'Option B']).slice(0, 2).map(createQuestionOption)
      };
    case 'checkbox':
    case 'image-choice':
      return {
        ...base,
        options: (legacyOptions || ['Option A', 'Option B', 'Option C']).map(createQuestionOption)
      };
    case 'audio-sequencing':
      return {
        ...base,
        instructions: 'Number the items in the order you hear them.',
        options: ['First item', 'Second item', 'Third item'].map(createQuestionOption)
      };
    case 'open-ended':
    case 'short-answer':
    case 'find-in-text':
    case 'correct-false':
    case 'true-false':
      return base;
    case 'fill-in-the-blank':
      return {
        ...base,
        instructions: '',
        columns: 1,
        mode: 'typing',
        wordSuggestions: [],
        gaps: [createQuestionGap()]
      };
    case 'matching':
      return {
        ...base,
        pairs: [
          { id: createEditorId(), left: 'Word', right: 'Meaning' },
          { id: createEditorId(), left: 'Question', right: 'Answer' }
        ]
      };
    case 'ordering':
      return { ...base, sequence: ['First', 'Second', 'Third'] };
    case 'table-completion':
      return { ...base, table: createQuestionTable() };
    default:
      return base;
  }
};

export const normalizeSubQuestion = (input: unknown): SubQuestion => {
  const candidate = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const type = typeof candidate.type === 'string' ? candidate.type : 'open-ended';
  const base = createSubQuestion(type as SubQuestion['type']);

  return {
    ...base,
    ...candidate,
    id: typeof candidate.id === 'string' ? candidate.id : base.id,
    type: base.type,
    question: typeof candidate.question === 'string' ? candidate.question : '',
    instructions: typeof candidate.instructions === 'string' ? candidate.instructions : base.instructions,
    columns: candidate.columns === 2 ? 2 : base.columns,
    mode: candidate.mode === 'dropdown' ? 'dropdown' : base.mode,
    options: Array.isArray(candidate.options)
      ? candidate.options.map((option) => {
          const optionRecord =
            option && typeof option === 'object' ? (option as Record<string, unknown>) : {};

          return {
            ...createQuestionOption(),
            ...optionRecord,
            id: typeof optionRecord.id === 'string' ? optionRecord.id : createEditorId(),
            text: typeof optionRecord.text === 'string' ? optionRecord.text : '',
            imageUrl:
              typeof optionRecord.imageUrl === 'string' ? optionRecord.imageUrl : undefined,
            audioUrl:
              typeof optionRecord.audioUrl === 'string' ? optionRecord.audioUrl : undefined,
            matchKey:
              typeof optionRecord.matchKey === 'string' ? optionRecord.matchKey : undefined
          };
        })
      : base.options,
    wordSuggestions: normalizeStringArray(candidate.wordSuggestions),
    pairs: Array.isArray(candidate.pairs)
      ? candidate.pairs.map((pair) => {
          const pairRecord = pair && typeof pair === 'object' ? (pair as Record<string, unknown>) : {};
          return {
            id: typeof pairRecord.id === 'string' ? pairRecord.id : createEditorId(),
            left: typeof pairRecord.left === 'string' ? pairRecord.left : '',
            right: typeof pairRecord.right === 'string' ? pairRecord.right : ''
          };
        })
      : base.pairs,
    sequence: normalizeStringArray(candidate.sequence),
    gaps: Array.isArray(candidate.gaps)
      ? candidate.gaps.map((gap) => {
          const gapRecord = gap && typeof gap === 'object' ? (gap as Record<string, unknown>) : {};
          return {
            id: typeof gapRecord.id === 'string' ? gapRecord.id : createEditorId()
          };
        })
      : base.gaps,
    table:
      candidate.table && typeof candidate.table === 'object'
        ? {
            headers: normalizeStringArray((candidate.table as Record<string, unknown>).headers),
            rows: Array.isArray((candidate.table as Record<string, unknown>).rows)
              ? ((candidate.table as Record<string, unknown>).rows as unknown[]).map((row) => {
                  const rowRecord =
                    row && typeof row === 'object' ? (row as Record<string, unknown>) : {};
                  return {
                    id: typeof rowRecord.id === 'string' ? rowRecord.id : createEditorId(),
                    cells: normalizeStringArray(rowRecord.cells)
                  };
                })
              : []
          }
        : base.table,
    feedback: typeof candidate.feedback === 'string' ? candidate.feedback : undefined
  };
};

export const normalizeSubQuestions = (value: unknown): SubQuestion[] =>
  Array.isArray(value) ? value.map((question) => normalizeSubQuestion(question)) : [];

export const createFlashcard = (): FlashcardsBlock['cards'][number] => ({
  id: createEditorId(),
  expressions: [''],
  frontImage: '',
  backText: '',
  backImage: '',
  imageFit: 'cover',
  imagePositionX: 50,
  imagePositionY: 50,
  imageZoom: 100,
  audioUrl: '',
  exampleSentence: '',
  translation: '',
  shortMeaning: '',
  category: '',
  tags: []
});

export const createImageChoiceOption = (): ImageChoiceBlock['options'][number] => ({
  id: createEditorId(),
  text: '',
  imageUrl: ''
});

export const createImageNumberingItem = (): ImageNumberingBlock['items'][number] => ({
  id: createEditorId(),
  imageUrl: '',
  correctNumber: 1,
  label: ''
});

export const createSelectionGridItem = (): SelectionGridBlock['items'][number] => ({
  id: createEditorId(),
  text: '',
  isCorrect: false
});

export const createMultipleChoiceOption = (): MultipleChoiceBlock['options'][number] => ({
  id: createEditorId(),
  text: ''
});

export const createPhrasalVerbItem = (): PhrasalVerbFocusBlock['items'][number] => ({
  id: createEditorId(),
  verb: '',
  meaning: '',
  examples: []
});

export const createVocabularyPair = (): VocabularyMatchBlock['pairs'][number] => ({
  id: createEditorId(),
  left: '',
  leftType: 'text',
  leftLabel: '',
  right: '',
  rightType: 'text',
  rightLabel: ''
});

export const createWordOrderItem = (): WordOrderBlock['items'][number] => ({
  id: createEditorId(),
  prompt: 'Put the sentence in order.',
  sentence: 'I go to school.'
});

export const createTableCompletionRow = (columnCount = 2): TableCompletionBlock['rows'][number] => ({
  id: createEditorId(),
  cells: Array.from({ length: columnCount }, (_, index) => (index === 0 ? `Row ${index + 1}` : ''))
});

export const createImageLabelItem = (): ImageLabelBlock['labels'][number] => ({
  id: createEditorId(),
  prompt: 'Label 1',
  answer: 'answer'
});

export const createQuestionSetDefaults = (): Pick<QuestionSetBlock, 'title' | 'instruction' | 'questions'> => ({
  title: 'Mixed Practice',
  instruction: 'Complete each exercise.',
  questions: [
    createSubQuestion('fill-in-the-blank', 'Complete the sentence.'),
    createSubQuestion('multiple-choice', 'Choose the best answer.'),
    createSubQuestion('open-ended', 'Write your own answer.')
  ]
});

export const createQuestionBuilderItem = (): QuestionBuilderItem => ({
  id: createEditorId(),
  mode: 'answer-given',
  questionText: '',
  answerText: ''
});

export const normalizeQuestionBuilderItems = (value: unknown): QuestionBuilderItem[] =>
  Array.isArray(value)
    ? value.map((item) => {
        const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
        return {
          id: typeof record.id === 'string' ? record.id : createEditorId(),
          mode:
            record.mode === 'question-only' ||
            record.mode === 'question-given' ||
            record.mode === 'answer-given' ||
            record.mode === 'free-both'
              ? record.mode
              : 'answer-given',
          questionText: typeof record.questionText === 'string' ? record.questionText : '',
          answerText: typeof record.answerText === 'string' ? record.answerText : ''
        };
      })
    : [];
