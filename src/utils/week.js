// UTC Monday-Sunday grouping, used by the weekly summaries endpoint.
export function getUtcWeekBounds(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - mondayOffset));
  const endExclusive = new Date(start.getTime() + 7 * 86400000);
  return { start, endExclusive };
}
