import * as Git from 'isomorphic-git';
import * as FS from 'fs';
import clone from '../../src/Repositories/clone';
import { buildCkusroConfig, buildRepositoryInfo } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { Repository } from '../../src/Repository';
import { gitDir, CkusroConfig } from '../../src';

describe(clone, () => {
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

  it.skip(clone.name, async () => {
    const url = 'https://github.com/tett23/ckusro.git';
    const expected = (await clone(config, fs, url)) as Repository;

    expect(expected).not.toBeInstanceOf(Error);
  });
});
