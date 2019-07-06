import * as Git from 'isomorphic-git';
import { fetchTreeEntries } from '../../src/RepositoryPrimitives/fetchTreeEntries';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { initRepository } from '../../src/Stage/prepare';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { TreeObject, isTreeObject, isBlobObject } from '../../src';

describe(fetchTreeEntries, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns Array<TreeObject|BlobObject>', async () => {
    const tree = (await headTree(config)) as TreeObject;
    const actual = (await fetchTreeEntries(config, tree.oid)) as TreeObject[];

    actual.forEach((item) =>
      expect(isTreeObject(item) || isBlobObject(item)).toBe(true),
    );
  });
});
