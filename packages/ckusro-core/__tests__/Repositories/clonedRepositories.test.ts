import * as FS from 'fs';
import clonedRepositories from '../../src/Repositories/clonedRepositories';
import {
  buildCkusroConfig,
  buildRepositoryInfo,
  buildRepoPath,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import { gitDir, CkusroConfig } from '../../src';
import { Repository } from '../../src/Repository';

describe(clonedRepositories, () => {
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

  it('returns Repository[]', async () => {
    const expected = (await clonedRepositories(fs, config)) as Repository[];

    expect(expected.length).toBe(1);
  });

  it('returns Repository[] when the repository have not been cloned', async () => {
    config.repositories = [
      buildRepositoryInfo({
        repoPath: buildRepoPath({ name: 'does_not_exist' }),
      }),
    ];
    const expected = (await clonedRepositories(fs, config)) as Repository[];

    expect(expected).toEqual([]);
  });
});
