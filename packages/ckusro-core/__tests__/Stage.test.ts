import * as Git from 'isomorphic-git';
import * as FS from 'fs';
import {
  prepareStageDirectory,
  prepareStageRepository,
  initRepository,
  prepareRepository,
  headOid,
  headTree,
  writeTree,
} from '../src/Stage';
import { buildCkusroConfig } from './__fixtures__';
import { pfs } from './__helpers__';
import { isTreeObject, TreeObject } from '../src';

const config = buildCkusroConfig();

// describe(writeBlob, () => {
//   beforeEach(() => {
//     const core = Git.cores.create(config.coreId);
//     const fs = pfs(config);
//     core.set('fs', fs);
//   });

//   it('returns TreeObject', async () => {
//     await initRepository(config);
//     const actual = await writeBlob(config);

//     expect(isTreeObject(actual as TreeObject)).toBe(true);
//   });
// });

describe(writeTree, () => {
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const actual = await writeTree(config);

    expect(isTreeObject(actual as TreeObject)).toBe(true);
  });
});
