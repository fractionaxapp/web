function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

/**
 * Recursively convert object keys from snake_case to camelCase. The agents
 * service (Python/Pydantic) emits snake_case; the web consumes camelCase via the
 * shared `@fractionax/domain` schemas, so the proxy routes transform at the edge.
 */
export function deepCamel(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(deepCamel);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [toCamel(k), deepCamel(v)]),
    );
  }
  return value;
}
