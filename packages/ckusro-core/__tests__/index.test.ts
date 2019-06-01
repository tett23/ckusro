import * as Git from 'isomorphic-git';
import { join } from 'path';
import { cloneRepo, fetchHeadOid } from '../src';
import { toPath } from '../src/models/RepoPath';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { pfs } from './__helpers__';

describe('Core', () => {
  it.skip(cloneRepo.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = await cloneRepo('test', config, url);

    expect(expected).toBe(true);
  });

  it(fetchHeadOid.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();

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
    const sha = await Git.commit({
      core: 'test',
      dir: toPath(config.base, repoPath),
      message: 'hoge',
      author: {
        name: 'tett23',
        email: 'tett23@example.com',
      },
    });

    const expected = await fetchHeadOid('test', config, repoPath);

    expect(expected).toBe(sha);
  });
});
