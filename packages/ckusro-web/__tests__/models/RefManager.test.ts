import { addRef } from '../../src/models/RefManager';
import { buildRef, buildRefManager } from '../__fixtures__';

describe('RefManager', () => {
  describe(addRef, () => {
    it('add new Ref', () => {
      const refManager = buildRefManager();
      const ref = buildRef();
      const expected = addRef(refManager, ref);

      expect(expected).toEqual({
        [ref.repository]: {
          [ref.name]: ref,
        },
      });
    });

    it('updates Ref', () => {
      const refManager = addRef(buildRefManager(), buildRef());
      const ref = buildRef({ oid: 'test' });
      const expected = addRef(refManager, ref);

      expect(expected).toEqual({
        [ref.repository]: {
          [ref.name]: ref,
        },
      });
    });
  });
});
