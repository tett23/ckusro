import * as Git from 'isomorphic-git';
import { LookUpGitObjectType, UnpersistedGitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import sortTreeEntries from '../models/GitObject/sortTreeEntries';
import { TreeEntry } from '../models/TreeEntry';

export async function writeObject<T extends UnpersistedGitObject>(
  config: IsomorphicGitConfig,
  object: T,
): Promise<LookUpGitObjectType<T['type']> | Error> {
  const content =
    object.type === 'tree'
      ? { entries: sortTreeEntries(object.content as TreeEntry[]) }
      : object.content;
  const oid = await (async () =>
    await Git.writeObject({
      ...config,
      type: object.type as T['type'],
      object: content as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    }))().catch((err: Error) => err);
  if (oid instanceof Error) {
    return oid;
  }

  const ret = {
    ...object,
    oid,
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  return ret as LookUpGitObjectType<T['type']>;
}
