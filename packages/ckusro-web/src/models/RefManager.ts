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
