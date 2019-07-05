import * as Git from 'isomorphic-git';
import { CkusroConfig } from '../models/CkusroConfig';
import { LookUpGitObjectType, UnpersistedGitObject } from '../models/GitObject';

export async function writeObject<T extends UnpersistedGitObject>(
  config: CkusroConfig,
  object: T,
): Promise<LookUpGitObjectType<T['type']> | Error> {
  const content =
    object.type === 'tree' ? { entries: object.content } : object.content;
  const oid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: object.type as T['type'],
    object: content as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  }).catch((err: Error) => err);
  if (oid instanceof Error) {
    return oid;
  }

  const ret = {
    ...object,
    oid,
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  return ret as LookUpGitObjectType<T['type']>;
}
