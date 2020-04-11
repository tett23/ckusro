import FS from 'fs';
import { checkout, pull, fetch } from '../src/Repository';
import { repository } from '../src/Repository';
import { buildIsomorphicGitConfig } from './__fixtures__';
import { pfs } from './__helpers__';
import { initRepository } from '../src/Stage/prepare';

describe(repository.name, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  describe(fetch, () => {
    it('returns true', async () => {
      const expected = await fetch(fs, config, 'master');

      expect(expected).not.toBe(Error);
    });
  });

  describe(pull, () => {
    it('returns string', async () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
  });

  describe(checkout, () => {
    it('returns void', async () => {
      const expected = await checkout(fs, config, 'master');

      expect(expected).not.toBe(Error);
    });
  });
});
