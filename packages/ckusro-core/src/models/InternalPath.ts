import { basename as _basename, join as _join } from 'path';
import { compareRepoPath, RepoPath } from './RepoPath';

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
  };
}

export function compareInternalPath(a: InternalPath, b: InternalPath): boolean {
  if (a === b) {
    return true;
  }

  return a.path === b.path && compareRepoPath(a.repoPath, b.repoPath);
}

export function basename(internalPath: InternalPath): string {
  if (internalPath.path.trim() === '/') {
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
