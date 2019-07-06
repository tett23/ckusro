import * as Git from 'isomorphic-git';
import {
  headCommitObject,
  headOid,
  headRootTree,
  readTree,
  checkout,
  fetch,
  fetchObjectByPath,
} from '../src/Repository';
import { repository } from '../src/Repository';
import { buildCkusroConfig, buildRepoPath } from './__fixtures__';
import { dummyRepo, pfs } from './__helpers__';
import { BlobObject } from '../src';

describe(repository.name, () => {
  it(headOid.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headOid(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headCommitObject.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headCommitObject(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(headRootTree.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
    core.set('fs', fs);
    const repoPath = buildRepoPath();
    await dummyRepo(config, fs, repoPath);

    const expected = await headRootTree(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(readTree.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
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

    const expected = await headRootTree(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  it(fetch.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
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

    const expected = await fetch(config, repoPath);

    expect(expected).not.toBe(Error);
  });

  describe(fetchObjectByPath, () => {
    const config = buildCkusroConfig();
    const repoPath = buildRepoPath();

    beforeAll(async () => {
      const core = Git.cores.create(config.coreId);
      const fs = pfs();
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
      const expected = await fetchObjectByPath(
        config,
        repoPath,
        '/foo/bar/baz.md',
      );

      expect((expected as BlobObject).content.toString()).toBe('baz.md');
    });

    it('returns Error when object does not exist', async () => {
      const expected = await fetchObjectByPath(
        config,
        repoPath,
        '/does_not_exist',
      );

      expect(expected).toBeInstanceOf(Error);
    });
  });

  it(checkout.name, async () => {
    const config = buildCkusroConfig();
    const core = Git.cores.create(config.coreId);
    const fs = pfs();
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

    const expected = await checkout(config, repoPath, 'master');

    expect(expected).not.toBe(Error);
  });
});
