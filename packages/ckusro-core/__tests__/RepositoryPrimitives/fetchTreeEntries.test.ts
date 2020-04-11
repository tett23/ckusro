import FS from 'fs';
import { fetchTreeEntries } from '../../src/RepositoryPrimitives/fetchTreeEntries';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { initRepository } from '../../src/Stage/prepare';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { TreeObject, isTreeObject, isBlobObject } from '../../src';

describe(fetchTreeEntries, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns Array<TreeObject|BlobObject>', async () => {
    const tree = (await headTree(fs, config)) as TreeObject;
    const actual = (await fetchTreeEntries(
      fs,
      config,
      tree.oid,
    )) as TreeObject[];

    actual.forEach((item) =>
      expect(isTreeObject(item) || isBlobObject(item)).toBe(true),
    );
  });
});
