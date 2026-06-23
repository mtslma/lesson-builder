import { z } from 'zod';

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
  pageNumber: numberField(),
  estimatedTime: requiredString().min(1, 'Campo obrigatório')
});

const headingBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('heading'),
  content: requiredString().min(1, 'Campo obrigatório'),
  level: z.enum(['h1', 'h2', 'h3', 'h4']).optional()
});

const paragraphBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('paragraph'),
  content: requiredString().min(1, 'Campo obrigatório'),
  style: z.enum(['body', 'intro', 'instruction', 'note']).optional()
});

const teacherNoteBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('teacher-note'),
  title: requiredString().min(1, 'Campo obrigatório'),
  content: requiredString().min(1, 'Campo obrigatório')
});

const grammarNoteBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('grammar-note'),
  title: requiredString().min(1, 'Campo obrigatório'),
  ruleContext: requiredString().min(1, 'Campo obrigatório'),
  expandableTitle: requiredString().min(1, 'Campo obrigatório'),
  expandableContent: requiredString().min(1, 'Campo obrigatório')
});

const advancedGrammarBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('advanced-grammar'),
  title: requiredString().min(1, 'Campo obrigatório'),
  explanation: requiredString(),
  tableHeaders: z.array(requiredString(), { error: 'Deve ser uma lista' }),
  tableRows: z.array(
    z.object({
      elements: z.array(requiredString(), { error: 'Deve ser uma lista' })
    }),
    { error: 'Deve ser uma lista' }
  )
});

const mediaBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('media-block'),
  url: requiredString().min(1, 'Campo obrigatório'),
  numbering: requiredString().optional(),
  position: z.enum(['left', 'center', 'right'])
});

const listeningBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('listening'),
  audioUrl: requiredString().min(1, 'Campo obrigatório'),
  maxPlays: numberField().optional(),
  contextImageUrl: requiredString().optional(),
  transcript: requiredString().optional(),
  transcriptVisibility: z.enum(['hidden', 'after-answer', 'always']).optional(),
  questions: z.array(subQuestionSchema, { error: 'Deve ser uma lista' })
});

const readingComprehensionBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('reading-comprehension'),
  title: requiredString().min(1, 'Campo obrigatório'),
  text: requiredString().min(1, 'Campo obrigatório'),
  questions: z.array(subQuestionSchema, { error: 'Deve ser uma lista' })
});

const conversationMessageSchema = z.object({
  id: requiredId(),
  speaker: requiredString().min(1, 'Campo obrigatório'),
  text: requiredString().min(1, 'Campo obrigatório'),
  highlighted: booleanField().optional(),
  highlightColor: requiredString().optional()
});

const conversationBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('conversation'),
  imageUrl: requiredString().optional(),
  messages: z.array(conversationMessageSchema, { error: 'Deve ser uma lista' }),
  substitutionBox: z
    .array(
      z.object({
        original: requiredString().min(1, 'Campo obrigatório'),
        alternatives: stringArray()
      }),
      { error: 'Deve ser uma lista' }
    )
    .optional()
});

const flashcardsBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('flashcards'),
  title: requiredString().min(1, 'Campo obrigatório'),
  category: requiredString().optional(),
  tags: stringArray().optional(),
  cards: z.array(
    z.object({
      id: requiredId(),
      frontText: requiredString().optional(),
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

const fillBlankBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('fill-blank'),
  instruction: requiredString().optional(),
  text: requiredString().min(1, 'Campo obrigatório'),
  gaps: z
    .array(
      z.object({
        id: requiredId(),
        acceptedAnswers: stringArray().min(1, 'Cada gap deve ter pelo menos uma resposta aceita'),
        caseSensitive: booleanField()
      }),
      { error: 'Deve ser uma lista' }
    )
    .min(1, 'Deve conter pelo menos um gap')
})
.superRefine((block, ctx) => {
  const usedGapIds = Array.from(block.text.matchAll(/\{\{([^}]+)\}\}/g)).map((match) => match[1]);
  const declaredGapIds = block.gaps.map((gap) => gap.id);

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

const multipleChoiceBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('multiple-choice'),
  question: requiredString().min(1, 'Campo obrigatório'),
  options: z.array(
    z.object({
      id: requiredId(),
      text: requiredString().min(1, 'Campo obrigatório')
    }),
    { error: 'Deve ser uma lista' }
  ).min(2, 'Deve conter pelo menos duas opções'),
  correctOptionIds: stringArray().min(1, 'Deve conter pelo menos uma resposta correta')
}).superRefine((block, ctx) => {
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
  characters: z.array(
    z.object({
      name: requiredString().min(1, 'Campo obrigatório'),
      country: requiredString().optional(),
      city: requiredString().optional(),
      activity: requiredString().optional()
    }),
    { error: 'Deve ser uma lista' }
  ),
  prompts: stringArray()
});

const conversationPromptsBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('conversation-prompts'),
  title: requiredString().min(1, 'Campo obrigatório'),
  prompts: stringArray()
});

const writingTaskBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('writing-task'),
  title: requiredString().min(1, 'Campo obrigatório'),
  prompt: requiredString().min(1, 'Campo obrigatório'),
  minWords: numberField().optional()
});

const finalTaskBlockSchema = z.object({
  id: requiredId(),
  type: z.literal('final-task'),
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
  schemaVersion: z.literal(1, { error: 'schemaVersion deve ser 1' }),
  id: requiredId(),
  title: requiredString(),
  level: requiredString(),
  language: requiredString(),
  blocks: z.array(blockSchema, { error: 'Deve ser uma lista' })
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
