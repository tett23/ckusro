import { basename as _basename } from 'path';
import { compareRepoPath, RepoPath } from './RepoPath';

export type InternalPath = {
  repoPath: RepoPath;
  path: string;
};

export function compareInternalPath(a: InternalPath, b: InternalPath): boolean {
  if (a === b) {
    return true;
  }

  return a.path === b.path && compareRepoPath(a.repoPath, b.repoPath);
}

export function basename(internalPath: InternalPath): string {
  return _basename(internalPath.path);
}
