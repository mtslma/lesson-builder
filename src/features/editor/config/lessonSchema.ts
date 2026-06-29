import { z } from 'zod';

const requiredString = () =>
  z.string({
    error: (issue) => (issue.input === undefined ? 'Campo obrigatorio' : 'Deve ser uma string')
  });

const requiredId = () => requiredString().min(1, 'Campo obrigatorio');
const audienceField = z.enum(['student', 'teacher', 'both']).optional();

const lessonMetaSchema = z.object({
  slug: requiredString().min(1, 'Campo obrigatorio'),
  createdAt: requiredString().min(1, 'Campo obrigatorio'),
  updatedAt: requiredString().min(1, 'Campo obrigatorio'),
  editorVersion: requiredString().min(1, 'Campo obrigatorio'),
  sourceLessonId: requiredString().min(1, 'Campo obrigatorio').optional(),
  sourceFormatVersion: z.number().optional()
});

const sharedQuestionSchema = z
  .object({
    id: requiredId(),
    type: requiredString().min(1, 'Campo obrigatorio'),
    question: requiredString(),
    instructions: requiredString().optional(),
    options: z.array(z.record(z.string(), z.unknown())).optional(),
    allowMultiple: z.boolean().optional(),
    pairs: z.array(z.record(z.string(), z.unknown())).optional(),
    sequence: z.array(requiredString()).optional(),
    gaps: z.array(z.record(z.string(), z.unknown())).optional(),
    table: z.record(z.string(), z.unknown()).optional(),
    feedback: requiredString().optional()
  })
  .passthrough();

const baseBlockSchema = z.object({
  id: requiredId(),
  type: requiredString().min(1, 'Campo obrigatorio'),
  audience: audienceField
});

const blockSchema = baseBlockSchema.passthrough();

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

export const publicBlockSchema = baseBlockSchema.passthrough();

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

export const formatImportIssues = (issues: z.ZodIssue[], limit = 5) => {
  const selectedIssues = issues.slice(0, limit).map((issue) => formatImportIssue(issue));
  const remaining = issues.length - selectedIssues.length;

  return [
    ...selectedIssues,
    remaining > 0 ? `...and ${remaining} more issue${remaining > 1 ? 's' : ''}` : null
  ].filter(Boolean) as string[];
};

export { sharedQuestionSchema };
