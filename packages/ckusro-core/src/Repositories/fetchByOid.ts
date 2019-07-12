import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { LookUpGitObjectType, GitObjectTypes } from '../models/GitObject';
import clonedRepositories from './clonedRepositories';
import separateErrors from '../utils/separateErrors';

export default async function fetchByOid<T extends GitObjectTypes>(
  config: CkusroConfig,
  fs: typeof FS,
  oid: string,
  objectType?: T,
): Promise<LookUpGitObjectType<T> | Error> {
  const repositories = await clonedRepositories(config, fs);
  if (repositories instanceof Error) {
    return repositories;
  }

  const ps = repositories.map((repo) => repo.fetchByOid(oid, objectType));
  const [maybeNull, errors] = separateErrors(await Promise.all(ps));
  if (errors.length !== 0) {
    return errors[0];
  }

  const object = maybeNull.find(
    (item): item is LookUpGitObjectType<T> => item != null,
  );
  if (object == null) {
    return new Error(`Object not found. oid=${oid}`);
  }

  return object;
}
