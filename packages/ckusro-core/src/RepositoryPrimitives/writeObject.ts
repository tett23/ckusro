import FS from 'fs';
import * as Git from 'isomorphic-git';
import { LookUpGitObjectType, UnpersistedGitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import sortTreeEntries from '../models/GitObject/sortTreeEntries';
import { TreeEntry } from '../models/TreeEntry';

export async function writeObject<T extends UnpersistedGitObject>(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  object: T,
): Promise<LookUpGitObjectType<T['type']> | Error> {
  const oid = await (async () =>
    await Git.writeObject({
      ...config,
      fs,
      type: object.type as T['type'],
      format: 'parsed',
      object: cast(object.type, object.content),
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

function cast(
  type: UnpersistedGitObject['type'],
  content: UnpersistedGitObject['content'],
) {
  content;
  switch (type) {
    case 'tree':
      return sortTreeEntries(content as TreeEntry[]);
    case 'blob':
      if (!(content instanceof Buffer)) {
        throw new Error('Blob format error');
      }

      return Uint8Array.from(content as Buffer);
    default:
      return content;
  }
}
