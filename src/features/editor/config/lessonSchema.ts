import { z } from 'zod';
import { normalizeConversationMessageInput } from '../domain/conversation';

const requiredString = () =>
  z.string({
    error: (issue) => (issue.input === undefined ? 'Campo obrigatório' : 'Deve ser uma string')
  });

const requiredId = () => requiredString().min(1, 'Campo obrigatório');

const booleanField = () =>
  z.boolean({
    error: (issue) =>
      issue.input === undefined ? 'Campo obrigatório' : 'Deve ser verdadeiro ou falso'
  });

const numberField = () =>
  z.number({
    error: (issue) => (issue.input === undefined ? 'Campo obrigatório' : 'Deve ser um número')
  });

const stringArray = () =>
  z.array(requiredString().min(1, 'Campo obrigatório'), {
    error: 'Deve ser uma lista'
  });

const audienceField = z.enum(['student', 'teacher', 'both']).optional();

const lessonMetaSchema = z.object({
  slug: requiredString().min(1, 'Campo obrigatÃ³rio'),
  createdAt: requiredString().min(1, 'Campo obrigatÃ³rio'),
  updatedAt: requiredString().min(1, 'Campo obrigatÃ³rio'),
  editorVersion: requiredString().min(1, 'Campo obrigatÃ³rio'),
  sourceLessonId: requiredString().min(1, 'Campo obrigatÃ³rio').optional(),
  sourceFormatVersion: numberField().optional()
});

const conversationHighlightSchemaBase = z.object({
  id: requiredId(),
  text: requiredString().min(1, 'Campo obrigatÃ³rio'),
  color: requiredString().min(1, 'Campo obrigatÃ³rio')
});

const subQuestionBase = {
  id: requiredId(),
  question: requiredString().min(1, 'Campo obrigatório')
};

const multipleChoiceQuestionSchema = z.object({
  ...subQuestionBase,
  type: z.literal('multiple-choice'),
  options: stringArray().min(2, 'Deve conter pelo menos duas opções'),
  answer: requiredString().min(1, 'Campo obrigatório').optional()
});

const trueFalseQuestionSchema = z.object({
  ...subQuestionBase,
  type: z.literal('true-false'),
  answer: requiredString().min(1, 'Campo obrigatório').optional()
});

const openEndedQuestionSchema = z.object({
  ...subQuestionBase,
  type: z.literal('open-ended'),
  answer: requiredString().min(1, 'Campo obrigatório').optional()
});

const subQuestionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  openEndedQuestionSchema
]);

const pageBreakBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('page-break'),
  audience: audienceField,
  pageNumber: numberField(),
  estimatedTime: requiredString().min(1, 'Campo obrigatório')
});

const headingBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('heading'),
  audience: audienceField,
  content: requiredString().min(1, 'Campo obrigatório'),
  level: z.enum(['h1', 'h2', 'h3', 'h4']).optional()
});

const paragraphBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('paragraph'),
  audience: audienceField,
  content: requiredString().min(1, 'Campo obrigatório'),
  style: z.enum(['body', 'intro', 'instruction', 'note']).optional()
});

const teacherNoteBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('teacher-note'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  content: requiredString().min(1, 'Campo obrigatório')
});

const grammarNoteBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('grammar-note'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  ruleContext: requiredString().min(1, 'Campo obrigatório'),
  expandableTitle: requiredString().min(1, 'Campo obrigatório'),
  expandableContent: requiredString().min(1, 'Campo obrigatório')
});

const advancedGrammarBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('advanced-grammar'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  explanation: requiredString(),
  details: requiredString().optional(),
  tableHeaders: z.array(requiredString(), { error: 'Deve ser uma lista' }),
  tableRows: z.array(
    z.object({
      cells: z.array(
        z.object({
          text: requiredString(),
          highlights: z
            .array(
              z.object({
                id: requiredId(),
                text: requiredString().min(1, 'Campo obrigatório'),
                color: requiredString().min(1, 'Campo obrigatório')
              })
            )
            .default([])
        }),
        { error: 'Deve ser uma lista' }
      )
    }),
    { error: 'Deve ser uma lista' }
  )
});

const mediaBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('media-block'),
  audience: audienceField,
  url: requiredString().min(1, 'Campo obrigatório'),
  numbering: requiredString().optional(),
  position: z.enum(['left', 'center', 'right'])
});

const listeningBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('listening'),
  audience: audienceField,
  title: requiredString().optional(),
  instruction: requiredString().optional(),
  audioUrl: requiredString().min(1, 'Campo obrigatório'),
  contextImageUrl: requiredString().optional(),
  script: z
    .array(
      z.preprocess(
        normalizeConversationMessageInput,
        z.object({
          id: requiredId(),
          speaker: requiredString(),
          text: requiredString(),
          highlights: z.array(conversationHighlightSchemaBase).default([])
        })
      ),
      { error: 'Deve ser uma lista' }
    )
    .optional(),
  transcript: requiredString().optional(),
  transcriptHighlights: z.array(conversationHighlightSchemaBase).default([]),
  transcriptVisibility: z.enum(['hidden', 'after-answer', 'always']).optional(),
  questions: z.array(subQuestionSchema, { error: 'Deve ser uma lista' })
});

const readingComprehensionBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('reading-comprehension'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  text: requiredString().min(1, 'Campo obrigatório'),
  questions: z.array(subQuestionSchema, { error: 'Deve ser uma lista' })
});

export const conversationHighlightSchema = conversationHighlightSchemaBase;

export const conversationMessageSchema = z.preprocess(
  normalizeConversationMessageInput,
  z.object({
    id: requiredId(),
    speaker: requiredString(),
    text: requiredString(),
    highlights: z.array(conversationHighlightSchema).default([])
  })
);

export const conversationBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('conversation'),
  audience: audienceField,
  imageUrl: requiredString().optional(),
  messages: z.array(conversationMessageSchema, {
    error: 'Deve ser uma lista'
  }),
  substitutionBox: z
    .array(
      z.object({
        original: requiredString().min(1, 'Campo obrigatório'),
        alternatives: stringArray()
      }),
      {
        error: 'Deve ser uma lista'
      }
    )
    .optional()
});

export type ConversationHighlight = z.infer<typeof conversationHighlightSchema>;

export type ConversationMessage = z.infer<typeof conversationMessageSchema>;

export type ConversationBlockSchemaType = z.infer<typeof conversationBlockSchema>;

const flashcardsBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('flashcards'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  category: requiredString().optional(),
  tags: stringArray().optional(),
  cards: z.array(
    z.object({
      id: requiredId(),
      frontText: requiredString().optional(),
      expressions: z.array(requiredString(), { error: 'Deve ser uma lista' }).default([]),
      frontImage: requiredString().optional(),
      backText: requiredString().min(1, 'Campo obrigatório'),
      backImage: requiredString().optional()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const vocabularyMatchBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('vocabulary-match'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  pairs: z.array(
    z.object({
      left: requiredString().min(1, 'Campo obrigatório'),
      leftType: z.enum(['text', 'image']),
      right: requiredString().min(1, 'Campo obrigatório')
    }),
    { error: 'Deve ser uma lista' }
  )
});

const imageNumberingBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('image-numbering'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  items: z.array(
    z.object({
      id: requiredId(),
      imageUrl: requiredString().min(1, 'Campo obrigatório'),
      correctNumber: numberField(),
      label: requiredString().min(1, 'Campo obrigatório')
    }),
    { error: 'Deve ser uma lista' }
  )
});

const selectionGridBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('selection-grid'),
  audience: audienceField,
  instruction: requiredString().min(1, 'Campo obrigatório'),
  isMultiSelect: booleanField(),
  items: z.array(
    z.object({
      id: requiredId(),
      text: requiredString().min(1, 'Campo obrigatório'),
      imageUrl: requiredString().optional(),
      isCorrect: booleanField().optional()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const imageChoiceBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('image-choice'),
  audience: audienceField,
  question: requiredString().min(1, 'Campo obrigatório'),
  options: z.array(
    z.object({
      id: requiredId(),
      text: requiredString().min(1, 'Campo obrigatório'),
      imageUrl: requiredString().optional()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const fillBlankBlockSchema = z
  .object({
    id: requiredId(),
    type: z.literal('fill-blank'),
    audience: audienceField,
    instruction: requiredString().optional(),
    text: requiredString().min(1, 'Campo obrigatório'),
    gaps: z
      .array(
        z.object({
          id: requiredId(),
          acceptedAnswers: stringArray(),
          suggestions: stringArray().optional(),
          caseSensitive: booleanField()
        }),
        { error: 'Deve ser uma lista' }
      )
      .min(1, 'Deve conter pelo menos um gap')
  })
  .superRefine((block, ctx) => {
    const usedGapIds = Array.from({ length: (block.text.match(/\[\]/g) || []).length }, (_, index) => `gap-${index}`);
    const declaredGapIds = Array.from({ length: block.gaps.length }, (_, index) => `gap-${index}`);

    for (const gapId of declaredGapIds) {
      if (!usedGapIds.includes(gapId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gaps'],
          message: `Gap declarado e não usado no texto: ${gapId}`
        });
      }
    }

    for (const gapId of usedGapIds) {
      if (!declaredGapIds.includes(gapId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['text'],
          message: `Gap usado no texto e não declarado: ${gapId}`
        });
      }
    }
  });

const multipleChoiceBlockSchema = z
  .object({
    id: requiredId(),
    type: z.literal('multiple-choice'),
    audience: audienceField,
    question: requiredString().min(1, 'Campo obrigatório'),
    options: z
      .array(
        z.object({
          id: requiredId(),
          text: requiredString().min(1, 'Campo obrigatório')
        }),
        { error: 'Deve ser uma lista' }
      )
      .min(2, 'Deve conter pelo menos duas opções'),
    correctOptionIds: stringArray().min(1, 'Deve conter pelo menos uma resposta correta')
  })
  .superRefine((block, ctx) => {
    const optionIds = new Set(block.options.map((option) => option.id));

    block.correctOptionIds.forEach((optionId, index) => {
      if (!optionIds.has(optionId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['correctOptionIds', index],
          message: `Resposta correta aponta para opção inexistente: ${optionId}`
        });
      }
    });
  });

const rewriteQuestionBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('rewrite-question'),
  audience: audienceField,
  instruction: requiredString().min(1, 'Campo obrigatório'),
  examples: z
    .array(
      z.object({
        input: requiredString().min(1, 'Campo obrigatório'),
        output: requiredString().min(1, 'Campo obrigatório')
      }),
      { error: 'Deve ser uma lista' }
    )
    .optional(),
  items: stringArray()
});

const repetitionDrillBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('repetition-drill'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  words: z.array(
    z.object({
      word: requiredString().min(1, 'Campo obrigatório'),
      phonetic: requiredString().optional(),
      translation: requiredString().optional()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const phrasalVerbFocusBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('phrasal-verb-focus'),
  audience: audienceField,
  title: requiredString().optional(),
  items: z.array(
    z.object({
      id: requiredId(),
      verb: requiredString().min(1, 'Campo obrigatório'),
      meaning: requiredString().min(1, 'Campo obrigatório'),
      examples: stringArray()
    }),
    { error: 'Deve ser uma lista' }
  ),
  verb: requiredString().optional(),
  meaning: requiredString().optional(),
  examples: stringArray().optional()
});

const roleplayBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('roleplay'),
  audience: audienceField,
  characters: z.array(
    z.object({
      name: requiredString().min(1, 'Campo obrigatório'),
      details: z.array(
        z.object({
          label: requiredString(),
          value: requiredString()
        }),
        { error: 'Deve ser uma lista' }
      ).default([])
    }),
    { error: 'Deve ser uma lista' }
  ),
  tips: requiredString()
});

const conversationPromptsBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('conversation-prompts'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  prompts: stringArray()
});

const writingTaskBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('writing-task'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  prompt: requiredString().min(1, 'Campo obrigatório'),
  minWords: numberField().optional()
});

const finalTaskBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('final-task'),
  audience: audienceField,
  title: requiredString().min(1, 'Campo obrigatório'),
  fields: stringArray()
});

export const blockSchema = z.discriminatedUnion('type', [
  pageBreakBlockSchema,
  headingBlockSchema,
  paragraphBlockSchema,
  teacherNoteBlockSchema,
  grammarNoteBlockSchema,
  advancedGrammarBlockSchema,
  mediaBlockSchema,
  listeningBlockSchema,
  readingComprehensionBlockSchema,
  conversationBlockSchema,
  flashcardsBlockSchema,
  vocabularyMatchBlockSchema,
  imageNumberingBlockSchema,
  selectionGridBlockSchema,
  imageChoiceBlockSchema,
  fillBlankBlockSchema,
  multipleChoiceBlockSchema,
  rewriteQuestionBlockSchema,
  repetitionDrillBlockSchema,
  phrasalVerbFocusBlockSchema,
  roleplayBlockSchema,
  conversationPromptsBlockSchema,
  writingTaskBlockSchema,
  finalTaskBlockSchema
]);

export const lessonSchema = z.object({
  documentType: z.literal('lesson-authoring'),
  formatVersion: z.literal(2),
  schemaVersion: z.literal(1, { error: 'schemaVersion deve ser 1' }),
  id: requiredId(),
  title: requiredString(),
  level: requiredString(),
  language: requiredString(),
  meta: lessonMetaSchema,
  blocks: z.array(blockSchema, { error: 'Deve ser uma lista' })
});

const publicListeningQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    ...subQuestionBase,
    type: z.literal('multiple-choice'),
    options: stringArray().min(2, 'Deve conter pelo menos duas opções')
  }),
  z.object({
    ...subQuestionBase,
    type: z.literal('true-false')
  }),
  z.object({
    ...subQuestionBase,
    type: z.literal('open-ended')
  })
]);

const publicListeningBlockSchema = listeningBlockSchema.extend({
  questions: z.array(publicListeningQuestionSchema, { error: 'Deve ser uma lista' })
});

const publicReadingBlockSchema = readingComprehensionBlockSchema.extend({
  questions: z.array(publicListeningQuestionSchema, { error: 'Deve ser uma lista' })
});

const publicSelectionGridBlockSchema = selectionGridBlockSchema.extend({
  items: z.array(
    z.object({
      id: requiredId(),
      text: requiredString().min(1, 'Campo obrigatório'),
      imageUrl: requiredString().optional()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const publicFillBlankBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('fill-blank'),
  audience: audienceField,
  instruction: requiredString().optional(),
  text: requiredString().min(1, 'Campo obrigatório'),
  gaps: z.array(
    z.object({
      id: requiredId()
    }),
    { error: 'Deve ser uma lista' }
  )
});

const publicMultipleChoiceBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('multiple-choice'),
  audience: audienceField,
  question: requiredString().min(1, 'Campo obrigatório'),
  options: z
    .array(
      z.object({
        id: requiredId(),
        text: requiredString().min(1, 'Campo obrigatório')
      }),
      { error: 'Deve ser uma lista' }
    )
    .min(2, 'Deve conter pelo menos duas opções')
});

export const publicBlockSchema = z.discriminatedUnion('type', [
  pageBreakBlockSchema,
  headingBlockSchema,
  paragraphBlockSchema,
  grammarNoteBlockSchema,
  advancedGrammarBlockSchema,
  mediaBlockSchema,
  publicListeningBlockSchema,
  publicReadingBlockSchema,
  conversationBlockSchema,
  flashcardsBlockSchema,
  vocabularyMatchBlockSchema,
  imageNumberingBlockSchema,
  publicSelectionGridBlockSchema,
  imageChoiceBlockSchema,
  publicFillBlankBlockSchema,
  publicMultipleChoiceBlockSchema,
  rewriteQuestionBlockSchema,
  repetitionDrillBlockSchema,
  phrasalVerbFocusBlockSchema,
  roleplayBlockSchema,
  conversationPromptsBlockSchema,
  writingTaskBlockSchema,
  finalTaskBlockSchema
]);

export const publicLessonSchema = z.object({
  documentType: z.literal('lesson-public'),
  formatVersion: z.literal(2),
  schemaVersion: z.literal(1, { error: 'schemaVersion deve ser 1' }),
  id: requiredId(),
  title: requiredString(),
  level: requiredString(),
  language: requiredString(),
  meta: lessonMetaSchema,
  blocks: z.array(publicBlockSchema, { error: 'Deve ser uma lista' })
});

export const lessonImportSchema = lessonSchema.superRefine((lesson, ctx) => {
  const seenBlockIds = new Map<string, number>();

  lesson.blocks.forEach((block, index) => {
    if (seenBlockIds.has(block.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['blocks', index, 'id'],
        message: `ID duplicado com blocks[${seenBlockIds.get(block.id)}].id`
      });
      return;
    }

    seenBlockIds.set(block.id, index);
  });
});

const formatPath = (path: PropertyKey[]) =>
  path.reduce<string>((acc, part) => {
    if (typeof part === 'number') return `${acc}[${part}]`;
    if (typeof part === 'symbol') return acc;
    return acc ? `${acc}.${String(part)}` : String(part);
  }, '');

export const formatImportIssue = (issue: z.ZodIssue) => {
  const path = formatPath(issue.path);
  return path ? `${path}: ${issue.message}` : issue.message;
};


