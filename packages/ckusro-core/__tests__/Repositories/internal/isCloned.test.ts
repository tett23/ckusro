import * as FS from 'fs';
import {
  buildCkusroConfig,
  buildRepositoryInfo,
  buildRepoPath,
} from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import { gitDir, CkusroConfig } from '../../../src';
import isCloned from '../../../src/Repositories/internal/isCloned';

describe(isCloned, () => {
  let config: CkusroConfig;
  let fs: typeof FS;
  beforeEach(async () => {
    config = buildCkusroConfig({ repositories: [buildRepositoryInfo()] });
    fs = pfs();

    config.repositories.forEach(({ repoPath }) => {
      fs.mkdirSync(gitDir(config.base, repoPath), {
        recursive: true,
      });
    });
  });

  it('returns true when the repository cloned', async () => {
    const expected = (await isCloned(
      config,
      fs,
      config.repositories[0].repoPath,
    )) as boolean;

    expect(expected).toBe(true);
  });

  it('returns Repository[] when the repository have not been cloned', async () => {
    config.repositories = [
      buildRepositoryInfo({
        repoPath: buildRepoPath({ name: 'does_not_exist' }),
      }),
    ];
    const expected = (await isCloned(
      config,
      fs,
      config.repositories[0].repoPath,
    )) as boolean;

    expect(expected).toBe(false);
  });
});
