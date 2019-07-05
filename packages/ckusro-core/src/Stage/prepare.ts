import FS from 'fs';
import * as Git from 'isomorphic-git';
import { CkusroConfig } from '../models/CkusroConfig';

export async function prepare(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<true | Error> {
  const result = await prepareStageDirectory(config, fs);
  if (result instanceof Error) {
    return result;
  }

  const result2 = await prepareStageRepository(config);
  if (result2 instanceof Error) {
    return result2;
  }

  const result3 = await initRepository(config);
  if (result3 instanceof Error) {
    return result3;
  }

  return true;
}

export async function initRepository(
  config: CkusroConfig,
): Promise<true | Error> {
  const blobOid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: 'blob',
    object: '',
  }).catch((err: Error) => err);
  if (blobOid instanceof Error) {
    return blobOid;
  }

  const treeOid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: 'tree',
    object: {
      entries: [
        {
          mode: '100644',
          path: '.gitkeep',
          oid: blobOid,
          type: 'blob',
        },
      ],
    },
  }).catch((err: Error) => err);
  if (treeOid instanceof Error) {
    return treeOid;
  }

  const author = {
    name: 'test',
    email: 'test@example.com',
    timestamp: 1,
    timezoneOffset: 0,
  };

  const commitOid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: 'commit',
    object: {
      message: 'test',
      tree: treeOid,
      parent: [],
      author,
      committer: author,
    },
  }).catch((err: Error) => err);
  if (commitOid instanceof Error) {
    return commitOid;
  }

  const writeRefResult = await Git.writeRef({
    core: config.coreId,
    gitdir: config.stage,
    ref: 'HEAD',
    value: commitOid,
    force: true,
  }).catch((err: Error) => err);
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  return true;
}

export async function prepareStageDirectory(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<true | Error> {
  const statResult = await fs.promises
    .stat(config.stage)
    .catch((err: Error) => err);
  if (!(statResult instanceof Error)) {
    return true;
  }

  const mkdirResult = await fs.promises
    .mkdir(config.stage)
    .catch((err: Error) => err);
  if (mkdirResult instanceof Error) {
    return mkdirResult;
  }

  return true;
}

export async function prepareStageRepository(
  config: CkusroConfig,
): Promise<true | Error> {
  const initResult = await Git.init({
    core: config.coreId,
    gitdir: config.stage,
    bare: true,
  }).catch((err: Error) => err);
  if (initResult instanceof Error) {
    return initResult;
  }

  return true;
}
