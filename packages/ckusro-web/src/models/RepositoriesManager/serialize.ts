import { RepositoriesManager } from './index';
import { RefManager } from '../RefManager';
import { PathManager } from '../PathManager';

type SerializedRepositoriesManager = {
  oids: string[];
  stageHead: string | null;
  stagePathManager: PathManager;
  repositoryPathManager: PathManager;
  refManager: RefManager;
};

export function serialize(
  manager: RepositoriesManager,
): SerializedRepositoriesManager {
  return {
    oids: Object.keys(manager.objectManager.originalObjects),
    stageHead: manager.stageHead,
    stagePathManager: manager.stagePathManager,
    repositoryPathManager: manager.repositoryPathManager,
    refManager: manager.refManager,
  };
}
