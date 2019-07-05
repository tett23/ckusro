import { join } from 'path';
import normalizePath from './normalizePath';

export default function splitPath(path: string): string[] {
  return normalizePath(path)
    .split('/')
    .slice(1)
    .filter((item) => item.length !== 0)
    .reduce(
      (acc: string[], item) => {
        acc.push(join('/', ...acc.slice(-1), item));

        return acc;
      },
      ['/'],
    );
}
