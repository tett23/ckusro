import { basename, compareInternalPath } from '../../src/models/InternalPath';
import { buildInternalPath, buildRepoPath } from '../__fixtures__';

describe(compareInternalPath, () => {
  it('returns boolean', () => {
    let a = buildInternalPath();
    let b = buildInternalPath();

    expect(compareInternalPath(a, b)).toBe(true);

    a = buildInternalPath({ path: 'foo' });
    b = buildInternalPath({ path: 'bar' });

    expect(compareInternalPath(a, b)).toBe(false);

    a = buildInternalPath({ repoPath: buildRepoPath({ name: 'foo' }) });
    b = buildInternalPath({ repoPath: buildRepoPath({ name: 'bar' }) });

    expect(compareInternalPath(a, b)).toBe(false);
  });

  it('returns true when a and b is same object', () => {
    const a = buildInternalPath();

    expect(compareInternalPath(a, a)).toBe(true);
  });
});

describe(basename, () => {
  it('returns string', () => {
    const internalPath = buildInternalPath({ path: '/foo/bar.md' });

    expect(basename(internalPath)).toBe('bar.md');
  });
});
