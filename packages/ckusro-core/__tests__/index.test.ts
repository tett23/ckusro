import { RepoPath, url2RepoPath } from '../src';

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
