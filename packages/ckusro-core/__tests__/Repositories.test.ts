import * as Git from 'isomorphic-git';
import { join } from 'path';
import { GitObject } from '../src/models/GitObject';
import {
  allRepositories,
  clone,
  fetchObject,
  headOids,
  repositories,
} from '../src/Repositories';
import { headOid } from '../src/Repository';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { dummyRepo, pfs } from './__helpers__';

describe(repositories.name, () => {
  it.skip(clone.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    const url = 'https://github.com/tett23/ckusro.git';

    const expected = await clone(config, url);

    expect(expected).not.toBeInstanceOf(Error);
  });

  it(allRepositories.name, async () => {
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

  describe(fetchObject.name, () => {
    it('returns GitObject', async () => {
      const config = buildCkusroConfig();
      const core = Git.cores.create(config.coreId);
      const fs = pfs(config);
      core.set('fs', fs);
      const repoPath = buildRepoPath();
      const commits = [
        {
          message: 'init',
          tree: {
            'README.md': 'read me',
            foo: {
              bar: {
                'baz.md': 'baz.md',
              },
            },
          },
        },
      ];
      await dummyRepo(config, fs, repoPath, commits);

      const oid = (await headOid(config, repoPath)) as string;
      const expected = await fetchObject(config, fs, oid);

      expect((expected as GitObject).oid).toBe(oid);
    });

    it('returns Error when object does not exists', async () => {
      const config = buildCkusroConfig();
      const fs = pfs(config);
      const expected = await fetchObject(config, fs, 'hoge');

      expect(expected).toBeInstanceOf(Error);
    });
  });

  it(headOids.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    const commits = [
      {
        message: 'init',
        tree: {
          'README.md': 'read me',
          foo: {
            bar: {
              'baz.md': 'baz.md',
            },
          },
        },
      },
    ];
    await dummyRepo(config, fs, repoPath, commits);

    const oid = (await headOid(config, repoPath)) as string;
    const expected = await headOids(config, fs);

    expect(expected).toMatchObject([[oid, repoPath]]);
  });
});
