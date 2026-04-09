export interface DateBatch {
  id: string;
  from: string;
  to: string;
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function monthlyBatches(start: string, end: string): DateBatch[] {
  const batches: DateBatch[] = [];
  let current = new Date(start + 'T00:00:00.000Z');
  const endDate = new Date(end + 'T00:00:00.000Z');

  while (current <= endDate) {
    const from = new Date(current);
    const to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0));
    const clippedTo = to > endDate ? endDate : to;
    batches.push({
      id: `${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}`,
      from: toIso(from),
      to: toIso(clippedTo)
    });
    current = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));
  }

  return batches;
}

export function weeklyBatches(start: string, end: string): DateBatch[] {
  const batches: DateBatch[] = [];
  let current = new Date(start + 'T00:00:00.000Z');
  const endDate = new Date(end + 'T00:00:00.000Z');
  let index = 0;

  while (current <= endDate) {
    const from = new Date(current);
    const to = new Date(from);
    to.setUTCDate(to.getUTCDate() + 6);
    const clippedTo = to > endDate ? endDate : to;
    batches.push({ id: `week-${index++}`, from: toIso(from), to: toIso(clippedTo) });
    current.setUTCDate(current.getUTCDate() + 7);
  }

  return batches;
}
