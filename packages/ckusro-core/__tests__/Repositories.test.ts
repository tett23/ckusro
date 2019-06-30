import * as Git from 'isomorphic-git';
import { join } from 'path';
import { GitObject, BlobObject } from '../src/models/GitObject';
import {
  allRepositories,
  clone,
  fetchObject,
  headOids,
  repositories,
  fetchObjectByInternalPath,
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

    const expected = await clone(config, fs, url);

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

  describe(fetchObjectByInternalPath, () => {
    const config = buildCkusroConfig();
    const repoPath = buildRepoPath();
    const fs = pfs(config);

    beforeAll(async () => {
      const core = Git.cores.create(config.coreId);
      core.set('fs', fs);
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
    });
    it('returns GitObject', async () => {
      const expected = await fetchObjectByInternalPath(config, fs, {
        repoPath,
        path: '/foo/bar/baz.md',
      });

      expect((expected as BlobObject).content.toString()).toBe('baz.md');
    });

    it('returns Error when object does not exist', async () => {
      const expected = await fetchObjectByInternalPath(config, fs, {
        repoPath: { ...repoPath, name: 'does_not_exist' },
        path: '/does_not_exist',
      });

      expect(expected).toBeInstanceOf(Error);
    });

    it('returns Error when object does not exist', async () => {
      const expected = await fetchObjectByInternalPath(config, fs, {
        repoPath,
        path: '/does_not_exist',
      });

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
