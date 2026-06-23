import { z } from 'zod';

const subQuestionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['multiple-choice', 'true-false', 'open-ended']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional()
});

const blockSchema = z
  .object({
    id: z.string().optional(),
    type: z.string()
  })
  .passthrough();

export const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  blocks: z.array(blockSchema)
});

export const lessonImportSchema = lessonSchema.superRefine((lesson, ctx) => {
  lesson.blocks.forEach((block, index) => {
    if (block.type === 'listening' || block.type === 'reading-comprehension') {
      const result = z.array(subQuestionSchema).safeParse(block.questions);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['blocks', index, 'questions'],
          message: 'Questions must follow the expected structure.'
        });
      }
    }
  });
});
