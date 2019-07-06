import { compareTreeEntry, compareTreeEntries, TreeEntry } from '../../src';
import { buildTreeEntry } from '../__fixtures__';

describe('GitObject', () => {
  describe(compareTreeEntry, () => {
    it('returns true', () => {
      const left = buildTreeEntry();
      const right = buildTreeEntry();
      const actual = compareTreeEntry(left, right);

      expect(actual).toBe(true);
    });

    it('returns true when left and right are same object', () => {
      const left = buildTreeEntry();
      const right = left;
      const actual = compareTreeEntry(left, right);

      expect(actual).toBe(true);
    });

    it('returns false', () => {
      const left = buildTreeEntry({ path: 'left' });
      const right = buildTreeEntry({ path: 'right' });
      const actual = compareTreeEntry(left, right);

      expect(actual).toBe(false);
    });
  });

  describe(compareTreeEntries, () => {
    it('returns true', () => {
      const left: TreeEntry[] = [];
      const right: TreeEntry[] = [];
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(true);
    });

    it('returns true when left and right are same object', () => {
      const left = [buildTreeEntry()];
      const right = left;
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(true);
    });

    it('returns false when left and right have same entries', () => {
      const left = [buildTreeEntry()];
      const right = [buildTreeEntry()];
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(true);
    });

    it('returns false', () => {
      const left: TreeEntry[] = [];
      const right = [buildTreeEntry()];
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(false);
    });

    it('returns false', () => {
      const left: TreeEntry[] = [buildTreeEntry()];
      const right: TreeEntry[] = [];
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(false);
    });

    it('returns false', () => {
      const left: TreeEntry[] = [buildTreeEntry({ path: 'left' })];
      const right: TreeEntry[] = [buildTreeEntry({ path: 'right' })];
      const actual = compareTreeEntries(left, right);

      expect(actual).toBe(false);
    });
  });
});
