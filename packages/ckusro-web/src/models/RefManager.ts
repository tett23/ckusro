import { RepoPath, toInternalPath } from '@ckusro/ckusro-core';

export type Ref = {
  readonly repository: string;
  readonly name: string;
  readonly oid: string;
};

export type RefManager = {
  readonly [repoName: string]: {
    readonly [refName: string]: Ref;
  };
};

export function createRefManager(refManager: RefManager) {
  return {
    addRef: (ref: Ref) => addRef(refManager, ref),
    headOid: (repoPath: RepoPath) => headOid(refManager, repoPath),
  };
}

export function addRef(refManager: RefManager, ref: Ref): RefManager {
  const ret = { ...refManager };
  ret[ref.repository] = {
    ...(ret[ref.repository] || {}),
    [ref.name]: ref,
  };

  return ret;
}

export function headOid(
  refManager: RefManager,
  repoPath: RepoPath,
): string | null {
  const refs = refManager[toInternalPath(repoPath)];
  if (refs == null) {
    return null;
  }

  const head = refs.HEAD;
  if (head == null) {
    return null;
  }

  return head.oid;
}
