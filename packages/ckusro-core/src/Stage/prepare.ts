import FS from 'fs';
import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export async function prepare(
  config: IsomorphicGitConfig,
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
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const blobOid = await Git.writeObject({
    ...config,
    type: 'blob',
    object: '',
  }).catch((err: Error) => err);
  if (blobOid instanceof Error) {
    return blobOid;
  }

  const treeOid = await Git.writeObject({
    ...config,
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
    ...config,
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
    ...config,
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
  config: IsomorphicGitConfig,
  fs: typeof FS,
): Promise<true | Error> {
  const statResult = await fs.promises
    .stat(config.gitdir)
    .catch((err: Error) => err);
  if (!(statResult instanceof Error)) {
    return true;
  }

  const mkdirResult = await fs.promises
    .mkdir(config.gitdir, { recursive: true })
    .catch((err: Error) => err);
  if (mkdirResult instanceof Error) {
    return mkdirResult;
  }

  return true;
}

export async function prepareStageRepository(
  config: IsomorphicGitConfig,
): Promise<true | Error> {
  const initResult = await Git.init({
    ...config,
    bare: true,
  }).catch((err: Error) => err);
  if (initResult instanceof Error) {
    return initResult;
  }

  return true;
}
