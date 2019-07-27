import { addRef, headOid } from '../../src/models/RefManager';
import { buildRef, buildRefManager } from '../__fixtures__';

describe('RefManager', () => {
  describe(addRef, () => {
    it('add new Ref', () => {
      const refManager = buildRefManager();
      const ref = buildRef();
      const actual = addRef(refManager, ref);

      expect(actual.refs).toEqual([ref]);
    });

    it('updates Ref', () => {
      const refManager = addRef(buildRefManager(), buildRef());
      const ref = buildRef({ oid: 'test' });
      const actual = addRef(refManager, ref);

      expect(actual.refs).toEqual([ref]);
    });
  });

  describe(headOid, () => {
    it('returns string', () => {
      const ref = buildRef({ name: 'HEAD' });
      const refManager = buildRefManager({ refs: [ref] });
      const actual = headOid(refManager, ref.repoPath);

      expect(actual).toBe(ref.oid);
    });

    it('returns null', () => {
      const ref = buildRef({ name: 'foo' });
      const refManager = buildRefManager({ refs: [ref] });
      const actual = headOid(refManager, ref.repoPath);

      expect(actual).toBe(null);
    });
  });
});
