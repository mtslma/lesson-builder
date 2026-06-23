import type { BlockType, Lesson, LessonBlock, PageBreakBlock } from '../types/index';

const createId = () => crypto.randomUUID();

export const createEmptyLesson = (): Lesson => ({
  id: createId(),
  title: 'Untitled lesson',
  level: '',
  language: 'en',
  blocks: []
});

const createSubQuestion = (
  type: 'multiple-choice' | 'true-false' | 'open-ended',
  question: string,
  options?: string[]
) => ({
  id: createId(),
  type,
  question,
  ...(options ? { options } : {})
});

export const createBlock = (type: BlockType, pageNumber: number): LessonBlock => {
  const id = createId();

  switch (type) {
    case 'page-break':
      return { id, type, pageNumber, estimatedTime: '45 min' } as PageBreakBlock;
    case 'heading':
      return { id, type, content: 'Learning Focus' };
    case 'paragraph':
      return {
        id,
        type,
        content: 'Use this area for neutral instructions, context, or brief lesson guidance.'
      };
    case 'grammar-note':
      return {
        id,
        type,
        title: 'Grammar Note',
        ruleContext: 'Add a short and neutral explanation of the language pattern here.',
        expandableTitle: 'See model examples',
        expandableContent: 'Example 1\nExample 2'
      };
    case 'advanced-grammar':
      return {
        id,
        type,
        title: 'Grammar Reference',
        explanation: 'Summarize the structure or contrast in a concise way.',
        tableHeaders: ['Form', 'Structure', 'Example'],
        tableRows: [
          { elements: ['Affirmative', 'Subject + verb', 'Example sentence'] },
          { elements: ['Negative', 'Subject + do/does not + verb', 'Example sentence'] }
        ]
      };
    case 'media-block':
      return {
        id,
        type,
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900',
        position: 'center',
        numbering: 'Visual reference'
      };
    case 'listening':
      return {
        id,
        type,
        audioUrl: 'audio-track.mp3',
        maxPlays: 2,
        questions: [
          createSubQuestion('true-false', 'The speaker agrees with the main idea.'),
          createSubQuestion('multiple-choice', 'What is the speaker describing?', [
            'A routine',
            'A place',
            'A preference'
          ])
        ]
      };
    case 'reading-comprehension':
      return {
        id,
        type,
        title: 'Reading Task',
        text: 'Insert a short neutral text here for reading practice and comprehension work.',
        questions: [
          createSubQuestion('multiple-choice', 'What is the text mainly about?', [
            'A person',
            'An activity',
            'A routine'
          ]),
          createSubQuestion('open-ended', 'What detail supports your answer?')
        ]
      };
    case 'conversation':
      return {
        id,
        type,
        messages: [
          { speaker: 'Speaker A', text: 'Hello. Welcome to the activity.' },
          { speaker: 'Speaker B', text: 'Thanks. I am ready to begin.', highlighted: true }
        ],
        substitutionBox: [{ original: 'I am ready to begin.', alternatives: ['Let us start.'] }]
      };
    case 'flashcards':
      return {
        id,
        type,
        title: 'Flashcard Set',
        cards: [{ id: createId(), frontText: 'Target word', backText: 'Meaning or explanation' }]
      };
    case 'vocabulary-match':
      return {
        id,
        type,
        title: 'Match the related items',
        pairs: [{ left: 'Word', leftType: 'text', right: 'Meaning' }]
      };
    case 'image-numbering':
      return {
        id,
        type,
        title: 'Sequence the visuals',
        items: [
          {
            id: createId(),
            imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300',
            correctNumber: 1,
            label: 'Step label'
          }
        ]
      };
    case 'selection-grid':
      return {
        id,
        type,
        instruction: 'Select the items that match the prompt.',
        isMultiSelect: true,
        items: [
          { id: createId(), text: 'Correct option', isCorrect: true },
          { id: createId(), text: 'Distractor option', isCorrect: false }
        ]
      };
    case 'image-choice':
      return {
        id,
        type,
        question: 'Select the image that matches the prompt.',
        options: [
          {
            id: createId(),
            text: 'Option A',
            imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300'
          }
        ]
      };
    case 'fill-blank':
      return {
        id,
        type,
        instruction: 'Complete the sentence with the best option.',
        textWithGaps: 'This is a [sample] sentence for practice.',
        supportWords: ['sample', 'practice']
      };
    case 'multiple-choice':
      return {
        id,
        type,
        question: 'Choose the best answer.',
        options: [
          { id: createId(), text: 'Option A', isCorrect: true },
          { id: createId(), text: 'Option B', isCorrect: false }
        ]
      };
    case 'rewrite-question':
      return {
        id,
        type,
        instruction: 'Rewrite each sentence according to the instruction.',
        examples: [{ input: 'Sample statement.', output: 'Sample transformed version.' }],
        items: ['Rewrite this sentence.']
      };
    case 'repetition-drill':
      return {
        id,
        type,
        title: 'Pronunciation Drill',
        words: [
          { word: 'Target', phonetic: '/target/' },
          { word: 'Pattern', phonetic: '/pattern/' }
        ]
      };
    case 'phrasal-verb-focus':
      return {
        id,
        type,
        verb: 'Target expression',
        meaning: 'Add a short neutral meaning here.',
        examples: ['Example sentence one.', 'Example sentence two.']
      };
    case 'roleplay':
      return {
        id,
        type,
        characters: [
          { name: 'Participant A', activity: 'Starting the discussion' },
          { name: 'Participant B', activity: 'Responding to the situation' }
        ],
        prompts: ['Introduce the scenario.', 'Respond with a follow-up question.']
      };
    case 'conversation-prompts':
      return {
        id,
        type,
        title: 'Discussion Prompts',
        prompts: ['What is your opinion on the topic?', 'What example can you share?']
      };
    case 'writing-task':
      return {
        id,
        type,
        title: 'Writing Task',
        prompt: 'Write a short response using the target language from the lesson.',
        minWords: 60
      };
    case 'final-task':
      return { id, type, title: 'Final Task', fields: ['Name', 'Response', 'Reflection'] };
    default:
      throw new Error(`Unsupported block type: ${type satisfies never}`);
  }
};

export const syncPageBreaks = (blocks: LessonBlock[]) => {
  let pageNumber = 0;

  return blocks.map((block) => {
    if (block.type !== 'page-break') return block;

    pageNumber += 1;
    return { ...block, pageNumber };
  });
};

export const nextPageNumber = (blocks: LessonBlock[]) =>
  blocks.filter((block) => block.type === 'page-break').length + 1;

export const normalizeLesson = (input: unknown): Lesson | null => {
  if (!input || typeof input !== 'object') return null;

  const candidate = input as Partial<Lesson> & { blocks?: unknown[] };
  if (!Array.isArray(candidate.blocks)) return null;

  return {
    id: candidate.id || createId(),
    title: candidate.title || 'Untitled lesson',
    level: candidate.level || '',
    language: candidate.language || 'en',
    blocks: syncPageBreaks(
      candidate.blocks.map((block) => ({
        ...((block as unknown as Record<string, unknown>) || {}),
        id:
          typeof (block as { id?: unknown }).id === 'string'
            ? (block as { id: string }).id
            : createId()
      })) as LessonBlock[]
    )
  };
};
