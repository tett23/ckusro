import { GitObject } from '..';
import { writeObject } from './writeObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import { UnpersistedGitObject } from '../models/GitObject';
import separateErrors from '../utils/separateErrors';
import { isErrors } from '../utils/types';

export default async function batchWriteObjects(
  config: IsomorphicGitConfig,
  objects: UnpersistedGitObject[],
): Promise<GitObject[] | Error> {
  const ps = objects.map((item) => writeObject(config, item));
  const result = await Promise.all(ps);
  const [ret, errors] = separateErrors(result);
  if (isErrors(errors)) {
    return errors[0];
  }

  return ret;
}
