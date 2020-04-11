import { GitObject, BlobObject } from '../../src/models/GitObject';
import { repositories } from '../../src/Repositories';
import fetchByOid from '../../src/Repositories/fetchByOid';
import fetchObjectByInternalPath from '../../src/Repositories/fetchObjectByInternalPath';
import headOid from '../../src/RepositoryPrimitives/headOid';
import {
  buildCkusroConfig,
  buildRepoPath,
  buildRepositoryInfo,
} from '../__fixtures__';
import { dummyRepo, pfs } from '../__helpers__';
import { toIsomorphicGitConfig } from '../../src/models/IsomorphicGitConfig';
import { initRepository } from '../../src/Stage/prepare';

describe(repositories.name, () => {
  describe(fetchByOid.name, () => {
    it('returns GitObject', async () => {
      const config = buildCkusroConfig();
      const fs = pfs();
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

      const oid = (await headOid(
        fs,
        toIsomorphicGitConfig(config, repoPath),
      )) as string;
      const expected = await fetchByOid(fs, config, oid);

      expect((expected as GitObject).oid).toBe(oid);
    });

    it('returns Error when object does not exists', async () => {
      const config = buildCkusroConfig();
      const fs = pfs();
      const expected = await fetchByOid(fs, config, 'hoge');

      expect(expected).toBeInstanceOf(Error);
    });
  });

  describe(fetchObjectByInternalPath, () => {
    const repoPath = buildRepoPath();
    const config = buildCkusroConfig({
      repositories: [buildRepositoryInfo({ repoPath })],
    });
    const gitConfig = toIsomorphicGitConfig(
      config,
      config.repositories[0].repoPath,
    );
    const fs = pfs();
    beforeEach(async () => {
      await initRepository(fs, gitConfig);
    });

    it('returns GitObject', async () => {
      const expected = (await fetchObjectByInternalPath(config, fs, {
        repoPath,
        path: '/.gitkeep',
      })) as BlobObject;

      expect(expected.content.toString()).toBe('');
    });

    it('returns Error when repository does not exist', async () => {
      const expected = await fetchObjectByInternalPath(config, fs, {
        repoPath: { ...repoPath, name: 'does_not_exist' },
        path: '/does_not_exist',
      });

      expect(expected).toBeInstanceOf(Error);
    });

    it('returns null when object does not exist', async () => {
      const expected = await fetchObjectByInternalPath(config, fs, {
        repoPath,
        path: '/does_not_exist',
      });

      expect(expected).toBe(null);
    });
  });
});
