import * as Git from 'isomorphic-git';
import { checkout, pull, fetch } from '../src/Repository';
import { repository } from '../src/Repository';
import { buildIsomorphicGitConfig } from './__fixtures__';
import { pfs } from './__helpers__';
import { initRepository } from '../src/Stage/prepare';

describe(repository.name, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  describe(fetch, () => {
    it.skip('returns true', async () => {
      const expected = await fetch(config, 'master');

      expect(expected).not.toBe(Error);
    });
  });

  describe(pull, () => {
    it.skip('returns string', async () => {});
  });

  describe(checkout, () => {
    it.skip('returns void', async () => {
      const expected = await checkout(config, 'master');

      expect(expected).not.toBe(Error);
    });
  });
});
