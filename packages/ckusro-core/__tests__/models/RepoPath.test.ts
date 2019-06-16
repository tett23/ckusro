import {
  compareRepoPath,
  RepoPath,
  toPath,
  url2RepoPath,
} from '../../src/models/RepoPath';
import { buildRepoPath } from '../__fixtures__';

describe(toPath, () => {
  it('returns RepoPath', () => {
    const urls = [
      'git+https://github.com/tett23/ckusro.git',
      'https://github.com/tett23/ckusro.git',
      'git@github.com:tett23/ckusro.git',
    ];
    const expected: RepoPath = {
      domain: 'github.com',
      user: 'tett23',
      name: 'ckusro',
    };

    urls.forEach((url) => {
      const actual = url2RepoPath(url);

      expect(actual).toEqual(expected);
    });
  });

  it('returns Error when passed invalid URL', () => {
    const actual = url2RepoPath('');

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(url2RepoPath, () => {
  it('returns RepoPath', () => {
    const urls = [
      'git+https://github.com/tett23/ckusro.git',
      'https://github.com/tett23/ckusro.git',
      'git@github.com:tett23/ckusro.git',
    ];
    const expected: RepoPath = {
      domain: 'github.com',
      user: 'tett23',
      name: 'ckusro',
    };

    urls.forEach((url) => {
      const actual = url2RepoPath(url);

      expect(actual).toEqual(expected);
    });
  });

  it('returns Error when passed invalid URL', () => {
    const actual = url2RepoPath('');

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(compareRepoPath, () => {
  it('returns boolean', () => {
    let a = buildRepoPath();
    let b = buildRepoPath();

    expect(compareRepoPath(a, b)).toBe(true);

    a = buildRepoPath({ name: 'foo' });
    b = buildRepoPath({ name: 'bar' });

    expect(compareRepoPath(a, b)).toBe(false);
  });

  it('returns true when a and b is same object', () => {
    const a = buildRepoPath();

    expect(compareRepoPath(a, a)).toBe(true);
  });
});
