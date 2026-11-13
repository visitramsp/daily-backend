import { z } from 'zod';

const dateSchema = z.string().datetime({ offset: true }).refine(value => !Number.isNaN(Date.parse(value)), 'Invalid date and time');
const schema = {
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(2000),
  dueAt: dateSchema,
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['in_progress', 'completed']),
};
export const createTaskSchema = z.object({
  title: schema.title,
  description: schema.description.optional().default(''),
  dueAt: schema.dueAt,
  priority: schema.priority.optional().default('medium'),
  status: schema.status.optional().default('in_progress'),
}).strict();
export const updateTaskSchema = z.object(schema).partial().strict().refine(value => Object.keys(value).length > 0, 'At least one field is required');
export const listTaskSchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: schema.status.optional(),
  priority: schema.priority.optional(),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(100),
}).strict();
export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new Error(result.error.issues.map(issue => `${issue.path.join('.') || 'Request'}: ${issue.message}`).join('; '));
    error.status = 400;
    throw error;
  }
  return result.data;
}
