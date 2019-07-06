import { basename as _basename, join as _join } from 'path';
import { compareRepoPath, RepoPath } from './RepoPath';
import normalizePath from '../utils/normalizePath';

export type InternalPath = {
  repoPath: RepoPath;
  path: string;
};

export function createInternalPath(internalPath: InternalPath) {
  return {
    compareInternalPath: (b: InternalPath) =>
      compareInternalPath(internalPath, b),
    basename: () => basename(internalPath),
    join: (...paths: string[]) => join(internalPath, ...paths),
    split: () => split(internalPath),
    flat: () => flat(internalPath),
  };
}

export function compareInternalPath(a: InternalPath, b: InternalPath): boolean {
  if (a === b) {
    return true;
  }

  return a.path === b.path && compareRepoPath(a.repoPath, b.repoPath);
}

export function basename(internalPath: InternalPath): string {
  if (normalizePath(internalPath.path) === '/') {
    return internalPath.repoPath.name;
  }

  return _basename(internalPath.path);
}

export function join(
  internalPath: InternalPath,
  ...paths: string[]
): InternalPath {
  return {
    repoPath: internalPath.repoPath,
    path: _join(internalPath.path, ...paths),
  };
}

export function split(internalPath: InternalPath): string[] {
  return [
    internalPath.repoPath.domain,
    internalPath.repoPath.user,
    internalPath.repoPath.name,
    ...normalizePath(internalPath.path)
      .slice(1)
      .split('/'),
  ];
}

export function flat(internalPath: InternalPath): string {
  return _join('/', ...split(internalPath));
}
