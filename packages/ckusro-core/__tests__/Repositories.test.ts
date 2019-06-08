import * as Git from 'isomorphic-git';
import { join } from 'path';
import { allRepositories, clone, repositories } from '../src/Repositories';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { pfs } from './__helpers__';

describe(repositories.name, () => {
  it.skip(clone.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create('test');
    const fs = pfs(config);
    core.set('fs', fs);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = await clone('test', config, url);

    expect(expected).not.toBeInstanceOf(Error);
  });

  it(clone.name, async () => {
    const config = buildCkusroConfig();
    const fs = pfs(config);

    fs.mkdirSync(join(config.base, 'example.com', 'test_user1', 'foo'), {
      recursive: true,
    });
    fs.mkdirSync(join(config.base, 'example.com', 'test_user2', 'bar'), {
      recursive: true,
    });
    const expected = await allRepositories(config, fs);

    expect(expected).toMatchObject([
      buildRepoPath({ domain: 'example.com', user: 'test_user1', name: 'foo' }),
      buildRepoPath({ domain: 'example.com', user: 'test_user2', name: 'bar' }),
    ]);
  });
});
