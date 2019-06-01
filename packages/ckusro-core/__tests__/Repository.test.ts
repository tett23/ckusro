import FS from 'fs';
import * as Git from 'isomorphic-git';
import { join } from 'path';
import { CkusroConfig } from '../src/models/CkusroConfig';
import { RepoPath, toPath } from '../src/models/RepoPath';
import { headCommitObject, headOid } from '../src/Repository';
import { repository } from '../src/Repository';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { pfs } from './__helpers__';

async function dummyRepo(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
) {
  fs.mkdirSync(toPath(config.base, repoPath), { recursive: true });
  await Git.init({
    core: 'test',
    dir: toPath(config.base, repoPath),
  });
  fs.writeFileSync(join(toPath(config.base, repoPath), 'README.md'), 'hoge');
  await Git.add({
    core: 'test',
    dir: toPath(config.base, repoPath),
    filepath: 'README.md',
  });
  await Git.commit({
    core: 'test',
    dir: toPath(config.base, repoPath),
    message: 'hoge',
    author: {
      name: 'tett23',
      email: 'tett23@example.com',
    },
  });
}

describe(repository.name, () => {
  it(headOid.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headOid(config, 'test', repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headCommitObject.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headCommitObject(config, 'test', repoPath);

    expect(expected).not.toBe(Error);
  });
});
