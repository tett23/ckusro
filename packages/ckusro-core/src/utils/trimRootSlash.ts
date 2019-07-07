import normalizePath from './normalizePath';
import { join } from 'path';

export default function trimRootSlash(path: string) {
  const normalized = normalizePath(join('/', path));

  return normalized.slice(1);
}
