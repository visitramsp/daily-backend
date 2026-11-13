import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskSchema, updateTaskSchema } from '../src/utils/validation.js';
import { getUtcWeekBounds } from '../src/utils/week.js';

test('create task requires title and date', () => {
  assert.equal(createTaskSchema.safeParse({ title: '', dueAt: '2026-11-12T09:00:00.000Z' }).success, false);
  assert.equal(createTaskSchema.safeParse({ title: 'Read', dueAt: '2026-11-12T09:00:00.000Z' }).success, true);
});
test('update task rejects empty payload and invalid priority', () => {
  assert.equal(updateTaskSchema.safeParse({}).success, false);
  assert.equal(updateTaskSchema.safeParse({ priority: 'urgent' }).success, false);
});
test('week begins Monday and ends Sunday', () => {
  const { start, endExclusive } = getUtcWeekBounds('2026-11-12T10:00:00Z');
  assert.equal(start.toISOString(), '2026-11-09T00:00:00.000Z');
  assert.equal(endExclusive.toISOString(), '2026-11-16T00:00:00.000Z');
});
