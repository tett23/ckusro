import * as Git from 'isomorphic-git';
import * as FS from 'fs';
import {
  buildCkusroConfig,
  buildRepositoryInfo,
  randomOid,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import { gitDir, CkusroConfig, GitObject } from '../../src';
import fetchByOid from '../../src/Repositories/fetchByOid';
import { toIsomorphicGitConfig } from '../../src/models/IsomorphicGitConfig';
import { repository } from '../../src/Repository';

describe(fetchByOid, () => {
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

  it('returns GitObject', async () => {
    const isoConfig = toIsomorphicGitConfig(
      config,
      config.repositories[0].repoPath,
    );
    const repo = repository(isoConfig, config.repositories[0].repoPath);
    const oid = (await repo.headOid()) as string;
    const expected = (await fetchByOid(config, fs, oid, 'commit')) as GitObject;

    expect(expected).not.toBeNull();
  });

  it('returns Error when the object does not exists', async () => {
    const expected = await fetchByOid(config, fs, randomOid());

    expect(expected).toBeInstanceOf(Error);
  });
});
