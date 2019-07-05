import { normalize } from 'path';

export default function normalizePath(path: string): string {
  const normalized = normalize(path).trim();
  if (normalized === '/') {
    return '/';
  }
  if (normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }

  return normalized;
}
