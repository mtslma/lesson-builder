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
import type { BlockType, LessonBlock } from '../types/index';
import { createConversationBlockDefaults, normalizeConversationHighlights } from '../domain/conversation';
import { createEditorId } from '../domain/ids';
import { createFlashcard, createSubQuestion } from '../domain/blockDefaults';

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
  normalize?: (block: Record<string, unknown>) => LessonBlock;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'page-break',
    label: 'Page Break',
    category: 'Layout & Theory',
    icon: ScissorsLineDashed,
    accent: 'text-slate-700',
    surface: 'from-slate-100 to-slate-50',
    create: (pageNumber) => ({
      id: createEditorId(),
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
    create: () => ({ id: createEditorId(), type: 'heading', content: 'Learning Focus', level: 'h2' }),
    form: HeadingForm as BlockFormComponent,
    preview: HeadingPreview as BlockPreviewComponent,
    normalize: (block) => ({
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'heading',
      content: typeof block.content === 'string' ? block.content : '',
      level:
        block.level === 'h1' || block.level === 'h2' || block.level === 'h3' || block.level === 'h4'
          ? block.level
          : 'h2'
    })
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    category: 'Layout & Theory',
    icon: PenLine,
    accent: 'text-cyan-700',
    surface: 'from-cyan-100 to-white',
    create: () => ({
      id: createEditorId(),
      type: 'paragraph',
      content: 'Use this area for neutral instructions, context, or brief lesson guidance.',
      style: 'body'
    }),
    form: ParagraphForm as BlockFormComponent,
    preview: ParagraphPreview as BlockPreviewComponent,
    normalize: (block) => ({
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'paragraph',
      content: typeof block.content === 'string' ? block.content : '',
      style:
        block.style === 'body' ||
        block.style === 'intro' ||
        block.style === 'instruction' ||
        block.style === 'note'
          ? block.style
          : 'body'
    })
  },
  {
    type: 'teacher-note',
    label: 'Teacher Note',
    category: 'Layout & Theory',
    icon: NotepadText,
    accent: 'text-amber-700',
    surface: 'from-amber-100 to-white',
    create: () => ({
      id: createEditorId(),
      type: 'teacher-note',
      audience: 'teacher',
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'advanced-grammar',
      title: 'Grammar Reference',
      explanation: 'Summarize the structure or contrast in a concise way.',
      details: '',
      tableHeaders: ['Form', 'Structure', 'Example'],
      tableRows: [
        {
          cells: [
            { text: 'Affirmative', highlights: [] },
            { text: 'Subject + verb', highlights: [] },
            { text: 'Example sentence', highlights: [] }
          ]
        },
        {
          cells: [
            { text: 'Negative', highlights: [] },
            { text: 'Subject + do not + verb', highlights: [] },
            { text: 'Example sentence', highlights: [] }
          ]
        }
      ]
    }),
    form: AdvancedGrammarForm as BlockFormComponent,
    preview: AdvancedGrammarPreview as BlockPreviewComponent,
    normalize: (block) => ({
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'advanced-grammar',
      title: typeof block.title === 'string' ? block.title : 'Grammar Reference',
      explanation: typeof block.explanation === 'string' ? block.explanation : '',
      details: typeof block.details === 'string' ? block.details : '',
      tableHeaders: Array.isArray(block.tableHeaders)
        ? block.tableHeaders.filter((header): header is string => typeof header === 'string')
        : [],
      tableRows: Array.isArray(block.tableRows)
        ? block.tableRows
            .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object'))
            .map((row) => ({
              cells: Array.isArray(row.cells)
                ? row.cells
                    .filter((cell): cell is Record<string, unknown> => Boolean(cell && typeof cell === 'object'))
                    .map((cell) => ({
                      text: typeof cell.text === 'string' ? cell.text : '',
                      highlights: Array.isArray(cell.highlights)
                        ? cell.highlights
                            .filter((highlight): highlight is Record<string, unknown> => Boolean(highlight && typeof highlight === 'object'))
                            .map((highlight) => ({
                              id: typeof highlight.id === 'string' ? highlight.id : createEditorId(),
                              text: typeof highlight.text === 'string' ? highlight.text : '',
                              color: typeof highlight.color === 'string' ? highlight.color : '#d9f99d'
                            }))
                        : []
                    }))
                : Array.isArray(row.elements)
                  ? row.elements
                      .filter((cell): cell is string => typeof cell === 'string')
                      .map((cell) => ({ text: cell, highlights: [] }))
                  : []
            }))
        : []
    })
  },
  {
    type: 'media-block',
    label: 'Image/Media',
    category: 'Reading & Media',
    icon: ImageIcon,
    accent: 'text-amber-700',
    surface: 'from-amber-100 to-white',
    create: () => ({
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'listening',
      title: 'Listening Track',
      audioUrl: 'audio-track.mp3',
      transcript: '',
      transcriptHighlights: [],
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
      return {
        id: typeof block.id === 'string' ? block.id : createEditorId(),
        type: 'listening',
        title: typeof block.title === 'string' ? block.title : '',
        audioUrl: typeof block.audioUrl === 'string' ? block.audioUrl : '',
        contextImageUrl: typeof block.contextImageUrl === 'string' ? block.contextImageUrl : undefined,
        transcript: typeof block.transcript === 'string' ? block.transcript : '',
        transcriptHighlights: normalizeConversationHighlights({
          text: typeof block.transcript === 'string' ? block.transcript : '',
          highlights: block.transcriptHighlights
        }),
        transcriptVisibility:
          block.transcriptVisibility === 'hidden' ||
          block.transcriptVisibility === 'after-answer' ||
          block.transcriptVisibility === 'always'
            ? block.transcriptVisibility
            : 'hidden',
        questions: Array.isArray(block.questions) ? block.questions : []
      };
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
      id: createEditorId(),
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'selection-grid',
      instruction: 'Select the items that match the prompt.',
      isMultiSelect: true,
      items: [
        { id: createEditorId(), text: 'Correct option', isCorrect: true },
        { id: createEditorId(), text: 'Distractor option', isCorrect: false }
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
      id: createEditorId(),
      type: 'phrasal-verb-focus',
      title: 'Phrasal Verb Set',
      items: [
        {
          id: createEditorId(),
          verb: 'Target expression',
          meaning: 'Add a short neutral meaning here.',
          examples: ['Example sentence one.', 'Example sentence two.']
        }
      ]
    }),
    form: PhrasalVerbForm as BlockFormComponent,
    preview: PhrasalVerbPreview as BlockPreviewComponent,
    normalize: (block) => {
      const typedItems = Array.isArray(block.items) ? block.items : undefined;

      const normalizedItems =
        typedItems && typedItems.length > 0
          ? typedItems.slice(0, 6).map((item) => ({
              id:
                item && typeof item === 'object' && typeof item.id === 'string' ? item.id : createEditorId(),
              verb:
                item && typeof item === 'object' && typeof item.verb === 'string' ? item.verb : '',
              meaning:
                item && typeof item === 'object' && typeof item.meaning === 'string'
                  ? item.meaning
                  : '',
              examples:
                item && typeof item === 'object' && Array.isArray(item.examples)
                  ? item.examples.filter(
                      (example: unknown): example is string => typeof example === 'string'
                    )
                  : []
            }))
          : [
              {
                id: createEditorId(),
                verb: typeof block.verb === 'string' ? block.verb : '',
                meaning: typeof block.meaning === 'string' ? block.meaning : '',
                examples: Array.isArray(block.examples)
                  ? block.examples.filter(
                      (example: unknown): example is string => typeof example === 'string'
                    )
                  : []
              }
            ];

      return {
        id: typeof block.id === 'string' ? block.id : createEditorId(),
        type: 'phrasal-verb-focus',
        title: typeof block.title === 'string' ? block.title : 'Phrasal Verb Set',
        verb: typeof block.verb === 'string' ? block.verb : undefined,
        meaning: typeof block.meaning === 'string' ? block.meaning : undefined,
        examples: Array.isArray(block.examples)
          ? block.examples.filter(
              (example: unknown): example is string => typeof example === 'string'
            )
          : undefined,
        items: normalizedItems
      };
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'fill-blank',
      instruction: 'Complete the sentence with the best option.',
      text: 'This is a [] sentence for practice.',
      columns: 1,
      gaps: [{ id: 'gap1', acceptedAnswers: ['sample'], suggestions: ['sample'], caseSensitive: false }]
    }),
    form: FillBlankForm as BlockFormComponent,
    preview: FillBlankPreview as BlockPreviewComponent,
    normalize: (block) => {
      const normalizedText =
        typeof block.text === 'string'
          ? block.text.replace(/\{\{[^}]+\}\}/g, '[]')
          : '';

      const placeholderCount = (normalizedText.match(/\[\]/g) || []).length;
      const rawGaps = Array.isArray(block.gaps)
        ? block.gaps.filter((gap): gap is Record<string, unknown> => Boolean(gap && typeof gap === 'object'))
        : [];

      return {
        id: typeof block.id === 'string' ? block.id : createEditorId(),
        type: 'fill-blank',
        instruction: typeof block.instruction === 'string' ? block.instruction : '',
        text: normalizedText,
        columns: block.columns === 2 ? 2 : 1,
        gaps: Array.from({ length: placeholderCount }, (_, index) => {
          const gap = rawGaps[index];

          return {
            id: gap && typeof gap.id === 'string' ? gap.id : `gap${index + 1}`,
            acceptedAnswers:
              gap && Array.isArray(gap.acceptedAnswers)
                ? gap.acceptedAnswers.filter((answer): answer is string => typeof answer === 'string')
                : [''],
            suggestions:
              gap && Array.isArray(gap.suggestions)
                ? gap.suggestions.filter((suggestion): suggestion is string => typeof suggestion === 'string')
                : undefined,
            caseSensitive:
              gap && typeof gap.caseSensitive === 'boolean' ? gap.caseSensitive : false
          };
        })
      };
    }
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    category: 'Practice & Quizzes',
    icon: CheckCheck,
    accent: 'text-green-700',
    surface: 'from-green-100 to-white',
    create: () => {
      const firstOptionId = createEditorId();
      const secondOptionId = createEditorId();
      return {
        id: createEditorId(),
        type: 'multiple-choice',
        question: 'Choose the best answer.',
        options: [
          { id: firstOptionId, text: 'Option A' },
          { id: secondOptionId, text: 'Option B' }
        ],
        correctOptionIds: [firstOptionId]
      };
    },
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'image-choice',
      question: 'Select the image that matches the prompt.',
      options: [
        {
          id: createEditorId(),
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
      id: createEditorId(),
      type: 'image-numbering',
      title: 'Sequence the visuals',
      items: [
        {
          id: createEditorId(),
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
      id: createEditorId(),
      type: 'conversation',
      ...createConversationBlockDefaults()
    }),
    form: ConversationForm as BlockFormComponent,
    preview: ConversationPreview as BlockPreviewComponent,
    normalize: (block) => {
      return {
        id: typeof block.id === 'string' ? block.id : createEditorId(),
        type: 'conversation',
        imageUrl: typeof block.imageUrl === 'string' ? block.imageUrl : undefined,
        messages: Array.isArray(block.messages)
          ? block.messages.map((message) => ({
              id:
                message && typeof message === 'object' && typeof message.id === 'string'
                  ? message.id
                  : createEditorId(),
              speaker:
                message && typeof message === 'object' && typeof message.speaker === 'string'
                  ? message.speaker
                  : '',
              text:
                message && typeof message === 'object' && typeof message.text === 'string'
                  ? message.text
                  : '',
              highlights: normalizeConversationHighlights(message)
            }))
          : [],
        substitutionBox: Array.isArray(block.substitutionBox)
          ? block.substitutionBox
              .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
              .map((item) => ({
                original: typeof item.original === 'string' ? item.original : '',
                alternatives: Array.isArray(item.alternatives)
                  ? item.alternatives.filter((option): option is string => typeof option === 'string')
                  : []
              }))
          : undefined
      };
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'roleplay',
      characters: [
        { name: 'Participant A', details: [{ label: 'Role', value: 'Starts the discussion' }] },
        { name: 'Participant B', details: [{ label: 'Role', value: 'Responds to the situation' }] }
      ],
      tips: 'Introduce the scenario and keep the conversation moving naturally.'
    }),
    form: RoleplayForm as BlockFormComponent,
    preview: RoleplayPreview as BlockPreviewComponent,
    normalize: (block) => ({
      id: typeof block.id === 'string' ? block.id : createEditorId(),
      type: 'roleplay',
      characters: Array.isArray(block.characters)
        ? block.characters
            .filter((character): character is Record<string, unknown> => Boolean(character && typeof character === 'object'))
            .map((character) => {
              const legacyDetails = [
                ['Country', character.country],
                ['City', character.city],
                ['Activity', character.activity]
              ]
                .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
                .map(([label, value]) => ({
                  label: label as string,
                  value: value as string
                }));

              return {
                name: typeof character.name === 'string' ? character.name : '',
                details: Array.isArray(character.details)
                  ? character.details
                      .filter((detail): detail is Record<string, unknown> => Boolean(detail && typeof detail === 'object'))
                      .map((detail) => ({
                        label: typeof detail.label === 'string' ? detail.label : '',
                        value: typeof detail.value === 'string' ? detail.value : ''
                      }))
                  : legacyDetails
              };
            })
        : [],
      tips:
        typeof block.tips === 'string'
          ? block.tips
          : Array.isArray(block.prompts)
            ? block.prompts.filter((prompt): prompt is string => typeof prompt === 'string').join('\n')
            : ''
    })
  },
  {
    type: 'writing-task',
    label: 'Writing Task',
    category: 'Production & Speaking',
    icon: PenLine,
    accent: 'text-stone-700',
    surface: 'from-stone-100 to-white',
    create: () => ({
      id: createEditorId(),
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
      id: createEditorId(),
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
      id: createEditorId(),
      type: 'flashcards',
      title: 'Flashcard Set',
      category: '',
      tags: [],
      cards: [{ ...createFlashcard(), expressions: ['Target word'], backText: 'Meaning or explanation' }]
    }),
    form: FlashcardsForm as BlockFormComponent,
    preview: FlashcardsPreview as BlockPreviewComponent,
    normalize: (block) => {
      return {
        id: typeof block.id === 'string' ? block.id : createEditorId(),
        type: 'flashcards',
        title: typeof block.title === 'string' ? block.title : 'Flashcard Set',
        category: typeof block.category === 'string' ? block.category : '',
        tags: Array.isArray(block.tags)
          ? block.tags.filter((tag): tag is string => typeof tag === 'string')
          : [],
        cards: Array.isArray(block.cards)
          ? block.cards
              .filter((card): card is Record<string, unknown> => Boolean(card && typeof card === 'object'))
              .map((card) => ({
                id: typeof card.id === 'string' ? card.id : createEditorId(),
                expressions: Array.isArray(card.expressions)
                  ? card.expressions.filter(
                      (expression): expression is string => typeof expression === 'string'
                    )
                  : typeof card.frontText === 'string'
                    ? [card.frontText]
                    : [],
                frontImage: typeof card.frontImage === 'string' ? card.frontImage : undefined,
                backText: typeof card.backText === 'string' ? card.backText : '',
                backImage: typeof card.backImage === 'string' ? card.backImage : undefined
              }))
          : []
      };
    }
  }
];

export const BLOCK_DEFINITION_MAP = Object.fromEntries(
  BLOCK_DEFINITIONS.map((definition) => [definition.type, definition])
) as Record<BlockType, BlockDefinition>;
