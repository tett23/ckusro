import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { Repository } from '../Repository';
import fetchRepository from './fetchRepository';
import isCloned from './internal/isCloned';
import separateErrors from '../utils/separateErrors';

export default async function clonedRepositories(
  fs: typeof FS,
  config: CkusroConfig,
): Promise<Repository[] | Error> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    const cloned = await isCloned(config, fs, repoPath);
    if (!cloned) {
      return null;
    }

    return fetchRepository(fs, config, repoPath);
  });
  const results = await Promise.all(ps);
  const [maybeNull, errors] = separateErrors(results);
  if (errors.length !== 0) {
    return errors[0];
  }

  return maybeNull.filter((item): item is Repository => item != null);
}
