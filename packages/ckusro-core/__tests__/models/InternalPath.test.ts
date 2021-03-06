import {
  basename,
  compareInternalPath,
  joinInternalPath,
  split,
  flat,
  tree,
  internalPathDirname,
} from '../../src/models/InternalPath';
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

  it('returns string', () => {
    const internalPath = buildInternalPath({ path: '/' });

    expect(basename(internalPath)).toBe(internalPath.repoPath.name);
  });
});

describe(joinInternalPath, () => {
  it('returns InternalPath', () => {
    const internalPath = buildInternalPath({ path: '/foo' });

    expect(joinInternalPath(internalPath, 'bar', 'baz.md')).toMatchObject({
      repoPath: internalPath.repoPath,
      path: '/foo/bar/baz.md',
    });
  });
});

describe(split, () => {
  it('returns string[]', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: '/foo',
    });

    expect(split(internalPath)).toMatchObject([
      'example.com',
      'test',
      'repo',
      'foo',
    ]);
  });
});

describe(tree, () => {
  it('returns string[]', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: '/foo',
    });

    expect(tree(internalPath)).toMatchObject([
      '/',
      '/example.com',
      '/example.com/test',
      '/example.com/test/repo',
      '/example.com/test/repo/foo',
    ]);
  });
});

describe(flat, () => {
  it('returns string', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: '/foo/bar',
    });

    expect(flat(internalPath)).toBe('/example.com/test/repo/foo/bar');
  });

  it('returns string', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: 'foo/bar',
    });

    expect(flat(internalPath)).toBe('/example.com/test/repo/foo/bar');
  });
});

describe(internalPathDirname, () => {
  it('returns string', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: '/foo/bar',
    });
    const actual = internalPathDirname(internalPath);

    expect(actual).toBe('/example.com/test/repo/foo');
  });

  it('returns string', () => {
    const internalPath = buildInternalPath({
      repoPath: buildRepoPath({
        domain: 'example.com',
        user: 'test',
        name: 'repo',
      }),
      path: '/',
    });
    const actual = internalPathDirname(internalPath);

    expect(actual).toBe('/example.com/test');
  });
});
