import * as Git from 'isomorphic-git';
import * as FS from 'fs';
import {
  buildCkusroConfig,
  buildRepositoryInfo,
  buildRepoPath,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import { gitDir, CkusroConfig } from '../../src';
import headOids from '../../src/Repositories/headOids';
import { OidRepoPath } from '../../src/models/OidRepoPath';

describe(headOids, () => {
  let config: CkusroConfig;
  let fs: typeof FS;
  beforeEach(async () => {
    config = buildCkusroConfig({
      repositories: [buildRepositoryInfo()],
    });
    fs = pfs();
    const core = Git.cores.create(config.coreId);
    core.set('fs', fs);

    config.repositories.forEach(({ repoPath }) => {
      fs.mkdirSync(gitDir(config.base, repoPath), {
        recursive: true,
      });
    });
  });

  it('returns OidRepoPath[]', async () => {
    const expected = (await headOids(config, fs)) as OidRepoPath[];

    expect(expected.length).toBe(1);
  });

  it('returns OidRepoPath[] when the repository have not been cloned', async () => {
    config.repositories = [
      buildRepositoryInfo({
        repoPath: buildRepoPath({ name: 'does_not_exist' }),
      }),
    ];
    const expected = (await headOids(config, fs)) as OidRepoPath[];

    expect(expected).toEqual([]);
  });

  it('returns OidRepoPath[] when mixed condition', async () => {
    config.repositories = [
      ...config.repositories,
      buildRepositoryInfo({
        repoPath: buildRepoPath({ name: 'does_not_exist' }),
      }),
    ];
    const expected = (await headOids(config, fs)) as OidRepoPath[];

    expect(expected.length).toBe(1);
  });
});
