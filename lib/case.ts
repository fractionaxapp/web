function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/**
 * Recursively convert object keys from camelCase to snake_case — the inverse of
 * {@link deepCamel}. Used by proxy routes that POST a camelCase body from the web
 * to the agents service, which expects snake_case (Python/Pydantic).
 */
export function deepSnake(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(deepSnake);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [toSnake(k), deepSnake(v)]),
    );
  }
  return value;
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
