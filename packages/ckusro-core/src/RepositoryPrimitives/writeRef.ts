import * as Git from 'isomorphic-git';
import { CommitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

const DefaultOptions = {
  force: false,
};

export type WriteRefOptions = {
  force: boolean;
};

export default async function writeRef(
  config: IsomorphicGitConfig,
  ref: string,
  commitObject: CommitObject,
  options?: Partial<WriteRefOptions>,
): Promise<true | Error> {
  const opts = { ...DefaultOptions, ...(options || {}) };

  const result = await (async () =>
    await Git.writeRef({
      ...config,
      ref,
      value: commitObject.oid,
      force: opts.force,
    }))().catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  return true;
}
