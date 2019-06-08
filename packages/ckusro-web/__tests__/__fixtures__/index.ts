import { Ref, RefManager } from '../../src/models/RefManager';

export function fixtureBuilder<T>(base: T): (override?: Partial<T>) => T {
  return (override: Partial<T> = {}) => {
    return { ...base, ...override };
  };
}

export const buildRef = fixtureBuilder<Ref>({
  repository: 'test_repo',
  name: 'HEAD',
  oid: '6250ead2a013f1e15bb8df838600ec8528fa5b8c',
});

export const buildRefManager = fixtureBuilder<RefManager>({});
