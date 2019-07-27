import { RepoPath, compareRepoPath } from '@ckusro/ckusro-core';

export type Ref = {
  readonly repoPath: RepoPath;
  readonly name: string;
  readonly oid: string;
};

export type RefManager = {
  readonly refs: Ref[];
};

export function createRefManager(refManager: RefManager) {
  return {
    addRef: (ref: Ref) => addRef(refManager, ref),
    headOid: (repoPath: RepoPath) => headOid(refManager, repoPath),
  };
}

export function addRef(manager: RefManager, ref: Ref): RefManager {
  const { refs } = manager;
  const idx = findRefIndex(manager, ref.repoPath, ref.name);
  if (idx === -1) {
    return { refs: [...refs, ref] };
  }

  return {
    refs: [...refs.slice(0, idx), ...refs.slice(idx + 1), ref],
  };
}

export function headOid(
  manager: RefManager,
  repoPath: RepoPath,
): string | null {
  const ref = findRef(manager, repoPath, 'HEAD');
  if (ref == null) {
    return null;
  }

  return ref.oid;
}

function findRefIndex(
  { refs }: RefManager,
  repoPath: RepoPath,
  name: string,
): number {
  return refs.findIndex(
    (item) => compareRepoPath(item.repoPath, repoPath) && item.name === name,
  );
}

function findRef(
  manager: RefManager,
  repoPath: RepoPath,
  name: string,
): Ref | null {
  const idx = findRefIndex(manager, repoPath, name);
  if (idx === -1) {
    return null;
  }

  return manager.refs[idx];
}
