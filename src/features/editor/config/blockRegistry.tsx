import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CheckCheck,
  ClipboardList,
  Headphones,
  Image as ImageIcon,
  Languages,
  MessageCircleMore,
  MicVocal,
  NotepadText,
  PenLine,
  ScanText,
  ScissorsLineDashed,
  Sparkles,
  SquarePen,
  Table2
} from 'lucide-react';
import { HeadingForm, HeadingPreview, ParagraphForm, ParagraphPreview } from '../modules/LayoutModule';
import { GrammarNoteForm, GrammarNotePreview, AdvancedGrammarForm, AdvancedGrammarPreview } from '../modules/GrammarModule';
import { MediaForm, MediaPreview, ListeningForm, ListeningPreview, ReadingComprehensionForm, ReadingComprehensionPreview } from '../modules/MediaModule';
import { VocabularyMatchForm, VocabularyMatchPreview, FlashcardsForm, FlashcardsPreview, RepetitionDrillForm, RepetitionDrillPreview, PhrasalVerbForm, PhrasalVerbPreview } from '../modules/VocabModule';
import { FillBlankForm, FillBlankPreview, SelectionGridForm, SelectionGridPreview, MultipleChoiceForm, MultipleChoicePreview, ImageChoiceForm, ImageChoicePreview, RewriteQuestionForm, RewriteQuestionPreview, ImageNumberingForm, ImageNumberingPreview } from '../modules/QuizModule';
import { ConversationForm, ConversationPreview, ConversationPromptsForm, ConversationPromptsPreview, RoleplayForm, RoleplayPreview, TeacherNoteForm, TeacherNotePreview, WritingTaskForm, WritingTaskPreview, FinalTaskForm, FinalTaskPreview } from '../modules/ProductionModule';
import type { BlockType, LessonBlock, ListeningBlock, FlashcardsBlock } from '../types/index';

const createId = () => crypto.randomUUID();

type BlockFormComponent = React.ComponentType<{
  block: LessonBlock;
  onUpdate: (fields: Partial<LessonBlock>) => void;
}>;

type BlockPreviewComponent = React.ComponentType<{ block: LessonBlock }>;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: string;
  icon: LucideIcon;
  accent: string;
  surface: string;
  create: (pageNumber: number) => LessonBlock;
  form?: BlockFormComponent;
  preview?: BlockPreviewComponent;
  normalize?: (block: LessonBlock) => LessonBlock;
}

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

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'page-break',
    label: 'Page Break',
    category: 'Layout & Theory',
    icon: ScissorsLineDashed,
    accent: 'text-slate-700',
    surface: 'from-slate-100 to-slate-50',
    create: (pageNumber) => ({
      id: createId(),
      type: 'page-break',
      pageNumber,
      estimatedTime: '45 min'
    })
  },
  {
    type: 'heading',
    label: 'Heading',
    category: 'Layout & Theory',
    icon: NotepadText,
    accent: 'text-sky-700',
    surface: 'from-sky-100 to-white',
    create: () => ({ id: createId(), type: 'heading', content: 'Learning Focus', level: 'h2' }),
    form: HeadingForm as BlockFormComponent,
    preview: HeadingPreview as BlockPreviewComponent,
    normalize: (block) => ({ ...block, level: (block as any).level || 'h2' } as LessonBlock)
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    category: 'Layout & Theory',
    icon: PenLine,
    accent: 'text-cyan-700',
    surface: 'from-cyan-100 to-white',
    create: () => ({
      id: createId(),
      type: 'paragraph',
      content: 'Use this area for neutral instructions, context, or brief lesson guidance.',
      style: 'body'
    }),
    form: ParagraphForm as BlockFormComponent,
    preview: ParagraphPreview as BlockPreviewComponent,
    normalize: (block) => ({ ...block, style: (block as any).style || 'body' } as LessonBlock)
  },
  {
    type: 'teacher-note',
    label: 'Teacher Note',
    category: 'Layout & Theory',
    icon: NotepadText,
    accent: 'text-amber-700',
    surface: 'from-amber-100 to-white',
    create: () => ({
      id: createId(),
      type: 'teacher-note',
      title: 'Teacher note',
      content: 'Add a short guidance note or tip for the student here.'
    }),
    form: TeacherNoteForm as BlockFormComponent,
    preview: TeacherNotePreview as BlockPreviewComponent
  },
  {
    type: 'grammar-note',
    label: 'Simple Grammar',
    category: 'Layout & Theory',
    icon: Sparkles,
    accent: 'text-blue-700',
    surface: 'from-blue-100 to-white',
    create: () => ({
      id: createId(),
      type: 'grammar-note',
      title: 'Grammar Note',
      ruleContext: 'Add a short and neutral explanation of the language pattern here.',
      expandableTitle: 'See model examples',
      expandableContent: 'Example 1\nExample 2'
    }),
    form: GrammarNoteForm as BlockFormComponent,
    preview: GrammarNotePreview as BlockPreviewComponent
  },
  {
    type: 'advanced-grammar',
    label: 'Grammar Table',
    category: 'Layout & Theory',
    icon: Table2,
    accent: 'text-indigo-700',
    surface: 'from-indigo-100 to-white',
    create: () => ({
      id: createId(),
      type: 'advanced-grammar',
      title: 'Grammar Reference',
      explanation: 'Summarize the structure or contrast in a concise way.',
      tableHeaders: ['Form', 'Structure', 'Example'],
      tableRows: [
        { elements: ['Affirmative', 'Subject + verb', 'Example sentence'] },
        { elements: ['Negative', 'Subject + do not + verb', 'Example sentence'] }
      ]
    }),
    form: AdvancedGrammarForm as BlockFormComponent,
    preview: AdvancedGrammarPreview as BlockPreviewComponent
  },
  {
    type: 'media-block',
    label: 'Image/Media',
    category: 'Reading & Media',
    icon: ImageIcon,
    accent: 'text-amber-700',
    surface: 'from-amber-100 to-white',
    create: () => ({
      id: createId(),
      type: 'media-block',
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900',
      position: 'center',
      numbering: 'Visual reference'
    }),
    form: MediaForm as BlockFormComponent,
    preview: MediaPreview as BlockPreviewComponent
  },
  {
    type: 'listening',
    label: 'Listen & Answer',
    category: 'Reading & Media',
    icon: Headphones,
    accent: 'text-rose-700',
    surface: 'from-rose-100 to-white',
    create: () => ({
      id: createId(),
      type: 'listening',
      audioUrl: 'audio-track.mp3',
      maxPlays: 2,
      transcript: '',
      transcriptVisibility: 'hidden',
      questions: [
        createSubQuestion('true-false', 'The speaker agrees with the main idea.'),
        createSubQuestion('multiple-choice', 'What is the speaker describing?', [
          'A routine',
          'A place',
          'A preference'
        ])
      ]
    }),
    form: ListeningForm as BlockFormComponent,
    preview: ListeningPreview as BlockPreviewComponent,
    normalize: (block) => {
      const listening = block as ListeningBlock;
      return {
        ...listening,
        transcript: listening.transcript || '',
        transcriptVisibility: listening.transcriptVisibility || 'hidden'
      } as LessonBlock;
    }
  },
  {
    type: 'reading-comprehension',
    label: 'Read & Answer',
    category: 'Reading & Media',
    icon: BookOpen,
    accent: 'text-emerald-700',
    surface: 'from-emerald-100 to-white',
    create: () => ({
      id: createId(),
      type: 'reading-comprehension',
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
    }),
    form: ReadingComprehensionForm as BlockFormComponent,
    preview: ReadingComprehensionPreview as BlockPreviewComponent
  },
  {
    type: 'vocabulary-match',
    label: 'Match Pairs',
    category: 'Interactive & Vocab',
    icon: Languages,
    accent: 'text-fuchsia-700',
    surface: 'from-fuchsia-100 to-white',
    create: () => ({
      id: createId(),
      type: 'vocabulary-match',
      title: 'Match the related items',
      pairs: [{ left: 'Word', leftType: 'text', right: 'Meaning' }]
    }),
    form: VocabularyMatchForm as BlockFormComponent,
    preview: VocabularyMatchPreview as BlockPreviewComponent
  },
  {
    type: 'selection-grid',
    label: 'Click & Check',
    category: 'Interactive & Vocab',
    icon: CheckCheck,
    accent: 'text-lime-700',
    surface: 'from-lime-100 to-white',
    create: () => ({
      id: createId(),
      type: 'selection-grid',
      instruction: 'Select the items that match the prompt.',
      isMultiSelect: true,
      items: [
        { id: createId(), text: 'Correct option', isCorrect: true },
        { id: createId(), text: 'Distractor option', isCorrect: false }
      ]
    }),
    form: SelectionGridForm as BlockFormComponent,
    preview: SelectionGridPreview as BlockPreviewComponent
  },
  {
    type: 'phrasal-verb-focus',
    label: 'Phrasal Verbs',
    category: 'Interactive & Vocab',
    icon: Sparkles,
    accent: 'text-violet-700',
    surface: 'from-violet-100 to-white',
    create: () => ({
      id: createId(),
      type: 'phrasal-verb-focus',
      title: 'Phrasal Verb Set',
      items: [
        {
          id: createId(),
          verb: 'Target expression',
          meaning: 'Add a short neutral meaning here.',
          examples: ['Example sentence one.', 'Example sentence two.']
        }
      ]
    }),
    form: PhrasalVerbForm as BlockFormComponent,
    preview: PhrasalVerbPreview as BlockPreviewComponent,
    normalize: (block) => {
      const phrasalBlock = block as any;
      const typedItems = phrasalBlock.items as
        | Array<{ id?: string; verb?: string; meaning?: string; examples?: string[] }>
        | undefined;

      const normalizedItems =
        typedItems && typedItems.length > 0
          ? typedItems.slice(0, 6).map((item) => ({
              id: item.id || createId(),
              verb: item.verb || '',
              meaning: item.meaning || '',
              examples: Array.isArray(item.examples) ? item.examples : []
            }))
          : [
              {
                id: createId(),
                verb: phrasalBlock.verb || '',
                meaning: phrasalBlock.meaning || '',
                examples: Array.isArray(phrasalBlock.examples) ? phrasalBlock.examples : []
              }
            ];

      return {
        ...phrasalBlock,
        title: phrasalBlock.title || 'Phrasal Verb Set',
        items: normalizedItems
      } as LessonBlock;
    }
  },
  {
    type: 'repetition-drill',
    label: 'Pronunciation',
    category: 'Interactive & Vocab',
    icon: MicVocal,
    accent: 'text-orange-700',
    surface: 'from-orange-100 to-white',
    create: () => ({
      id: createId(),
      type: 'repetition-drill',
      title: 'Pronunciation Drill',
      words: [
        { word: 'Target', phonetic: '/target/' },
        { word: 'Pattern', phonetic: '/pattern/' }
      ]
    }),
    form: RepetitionDrillForm as BlockFormComponent,
    preview: RepetitionDrillPreview as BlockPreviewComponent
  },
  {
    type: 'fill-blank',
    label: 'Inline Gaps',
    category: 'Practice & Quizzes',
    icon: SquarePen,
    accent: 'text-teal-700',
    surface: 'from-teal-100 to-white',
    create: () => ({
      id: createId(),
      type: 'fill-blank',
      instruction: 'Complete the sentence with the best option.',
      textWithGaps: 'This is a [sample] sentence for practice.',
      supportWords: ['sample', 'practice']
    }),
    form: FillBlankForm as BlockFormComponent,
    preview: FillBlankPreview as BlockPreviewComponent
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    category: 'Practice & Quizzes',
    icon: CheckCheck,
    accent: 'text-green-700',
    surface: 'from-green-100 to-white',
    create: () => ({
      id: createId(),
      type: 'multiple-choice',
      question: 'Choose the best answer.',
      options: [
        { id: createId(), text: 'Option A', isCorrect: true },
        { id: createId(), text: 'Option B', isCorrect: false }
      ]
    }),
    form: MultipleChoiceForm as BlockFormComponent,
    preview: MultipleChoicePreview as BlockPreviewComponent
  },
  {
    type: 'rewrite-question',
    label: 'Transform Text',
    category: 'Practice & Quizzes',
    icon: ScanText,
    accent: 'text-slate-700',
    surface: 'from-slate-100 to-white',
    create: () => ({
      id: createId(),
      type: 'rewrite-question',
      instruction: 'Rewrite each sentence according to the instruction.',
      examples: [{ input: 'Sample statement.', output: 'Sample transformed version.' }],
      items: ['Rewrite this sentence.']
    }),
    form: RewriteQuestionForm as BlockFormComponent,
    preview: RewriteQuestionPreview as BlockPreviewComponent
  },
  {
    type: 'image-choice',
    label: 'Image Choice',
    category: 'Practice & Quizzes',
    icon: ImageIcon,
    accent: 'text-yellow-700',
    surface: 'from-yellow-100 to-white',
    create: () => ({
      id: createId(),
      type: 'image-choice',
      question: 'Select the image that matches the prompt.',
      options: [
        {
          id: createId(),
          text: 'Option A',
          imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300'
        }
      ]
    }),
    form: ImageChoiceForm as BlockFormComponent,
    preview: ImageChoicePreview as BlockPreviewComponent
  },
  {
    type: 'image-numbering',
    label: 'Image Numbering',
    category: 'Practice & Quizzes',
    icon: ImageIcon,
    accent: 'text-yellow-700',
    surface: 'from-yellow-100 to-white',
    create: () => ({
      id: createId(),
      type: 'image-numbering',
      title: 'Sequence the visuals',
      items: [
        {
          id: createId(),
          imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300',
          correctNumber: 1,
          label: 'Step label'
        }
      ]
    }),
    form: ImageNumberingForm as BlockFormComponent,
    preview: ImageNumberingPreview as BlockPreviewComponent
  },
  {
    type: 'conversation',
    label: 'Dialogue',
    category: 'Production & Speaking',
    icon: MessageCircleMore,
    accent: 'text-cyan-700',
    surface: 'from-cyan-100 to-white',
    create: () => ({
      id: createId(),
      type: 'conversation',
      messages: [
        { id: createId(), speaker: 'Speaker A', text: 'Hello. Welcome to the activity.' },
        {
          id: createId(),
          speaker: 'Speaker B',
          text: '[Thanks]. I am ready to begin.',
          highlighted: true,
          highlightColor: '#d9f99d'
        }
      ],
      substitutionBox: [{ original: 'I am ready to begin.', alternatives: ['Let us start.'] }]
    }),
    form: ConversationForm as BlockFormComponent,
    preview: ConversationPreview as BlockPreviewComponent,
    normalize: (block) => {
      const conversation = block as any;
      return {
        ...conversation,
        messages: Array.isArray(conversation.messages)
          ? conversation.messages.map((message: any) => ({
              id: typeof message.id === 'string' ? message.id : createId(),
              speaker: message.speaker || '',
              text: message.text || '',
              highlighted: Boolean(message.highlighted),
              ...(message.highlightColor ? { highlightColor: message.highlightColor } : {})
            }))
          : []
      } as LessonBlock;
    }
  },
  {
    type: 'conversation-prompts',
    label: 'Discussion Prompts',
    category: 'Production & Speaking',
    icon: MessageCircleMore,
    accent: 'text-sky-700',
    surface: 'from-sky-100 to-white',
    create: () => ({
      id: createId(),
      type: 'conversation-prompts',
      title: 'Discussion Prompts',
      prompts: ['What is your opinion on the topic?', 'What example can you share?']
    }),
    form: ConversationPromptsForm as BlockFormComponent,
    preview: ConversationPromptsPreview as BlockPreviewComponent
  },
  {
    type: 'roleplay',
    label: 'Roleplay Cards',
    category: 'Production & Speaking',
    icon: ClipboardList,
    accent: 'text-red-700',
    surface: 'from-red-100 to-white',
    create: () => ({
      id: createId(),
      type: 'roleplay',
      characters: [
        { name: 'Participant A', activity: 'Starting the discussion' },
        { name: 'Participant B', activity: 'Responding to the situation' }
      ],
      prompts: ['Introduce the scenario.', 'Respond with a follow-up question.']
    }),
    form: RoleplayForm as BlockFormComponent,
    preview: RoleplayPreview as BlockPreviewComponent
  },
  {
    type: 'writing-task',
    label: 'Writing Task',
    category: 'Production & Speaking',
    icon: PenLine,
    accent: 'text-stone-700',
    surface: 'from-stone-100 to-white',
    create: () => ({
      id: createId(),
      type: 'writing-task',
      title: 'Writing Task',
      prompt: 'Write a short response using the target language from the lesson.',
      minWords: 60
    }),
    form: WritingTaskForm as BlockFormComponent,
    preview: WritingTaskPreview as BlockPreviewComponent
  },
  {
    type: 'final-task',
    label: 'Final Profile Task',
    category: 'Production & Speaking',
    icon: ClipboardList,
    accent: 'text-neutral-700',
    surface: 'from-neutral-100 to-white',
    create: () => ({
      id: createId(),
      type: 'final-task',
      title: 'Final Task',
      fields: ['Name', 'Response', 'Reflection']
    }),
    form: FinalTaskForm as BlockFormComponent,
    preview: FinalTaskPreview as BlockPreviewComponent
  },
  {
    type: 'flashcards',
    label: 'Flashcards',
    category: 'Interactive & Vocab',
    icon: Languages,
    accent: 'text-fuchsia-700',
    surface: 'from-fuchsia-100 to-white',
    create: () => ({
      id: createId(),
      type: 'flashcards',
      title: 'Flashcard Set',
      category: '',
      tags: [],
      cards: [{ id: createId(), frontText: 'Target word', backText: 'Meaning or explanation' }]
    }),
    form: FlashcardsForm as BlockFormComponent,
    preview: FlashcardsPreview as BlockPreviewComponent,
    normalize: (block) => {
      const flashcards = block as FlashcardsBlock;
      return {
        ...flashcards,
        category: flashcards.category || '',
        tags: Array.isArray(flashcards.tags) ? flashcards.tags : []
      } as LessonBlock;
    }
  }
];

export const BLOCK_DEFINITION_MAP = Object.fromEntries(
  BLOCK_DEFINITIONS.map((definition) => [definition.type, definition])
) as Record<BlockType, BlockDefinition>;
