const counters = new Map<string, number>();

export function incMetric(name: string, by = 1): void {
  counters.set(name, (counters.get(name) ?? 0) + by);
}

export function getMetricsSnapshot(): Record<string, number> {
  return Object.fromEntries(counters.entries());
}
