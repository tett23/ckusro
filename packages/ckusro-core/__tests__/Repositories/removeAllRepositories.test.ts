import * as FS from 'fs';
import { buildCkusroConfig, buildRepositoryInfo } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { gitDir, CkusroConfig } from '../../src';
import removeAllRepositories from '../../src/Repositories/removeAllRepositories';
import rmrf from '../../src/utils/rmrf';

describe(removeAllRepositories, () => {
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

  it('returns true', async () => {
    const expected = (await removeAllRepositories(config, fs)) as true;

    expect(expected).toBe(true);
  });

  it('returns true when the repositories directory does not exists', async () => {
    await rmrf(fs, config.base);
    const expected = (await removeAllRepositories(config, fs)) as true;

    expect(expected).toBe(true);
  });
});
