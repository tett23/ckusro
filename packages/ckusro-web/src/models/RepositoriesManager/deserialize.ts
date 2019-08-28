import { RepositoriesManager } from './index';
import { SerializedRepositoriesManager } from './serialize';
import { GitObject } from '@ckusro/ckusro-core';
import { splitError } from '../../utils';
import {
  createObjectManager,
  createEmptyObjectManager,
} from '../ObjectManager';

export default async function deserialize(
  serializedManager: SerializedRepositoriesManager,
  fetchOids: (oids: string[]) => Promise<Array<GitObject | null> | Error>,
): Promise<RepositoriesManager | Error> {
  const objects = await fetchOids(serializedManager.oids);
  if (objects instanceof Error) {
    return objects;
  }

  const [gitObjects] = splitError(objects);
  const objectManager = createObjectManager(
    createEmptyObjectManager(),
  ).addObjects(gitObjects.filter((item): item is GitObject => item != null));

  return {
    objectManager,
    stageHead: serializedManager.stageHead,
    stagePathCache: serializedManager.stagePathManager,
    repositoryPathManager: serializedManager.repositoryPathManager,
    refManager: serializedManager.refManager,
  };
}
