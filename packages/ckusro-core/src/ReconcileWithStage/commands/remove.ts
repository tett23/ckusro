import FS from 'fs';
import { Stage } from '../../Stage';
import { Repository } from '../../Repository';
import { InternalPath, createInternalPath } from '../../models/InternalPath';
import fetchParentsByInternalPath from '../internal/fetchParentsByInternalPath';
import { RepositoryPrimitives } from '../../RepositoryPrimitives';
import { PathTreeObject, WithStageParents } from '../../models/PathTreeObject';

export default async function remove(
  fs: typeof FS,
  repository: Repository,
  stage: Stage,
  internalPath: InternalPath,
): Promise<WithStageParents | null | Error> {
  if (internalPath.path.trim() === '/') {
    return new Error();
  }

  const parents = await fetchParentsByInternalPath(
    fs,
    repository,
    stage,
    internalPath,
  );
  if (parents instanceof Error) {
    return parents;
  }

  const basename = createInternalPath(internalPath).basename();
  const repoRemoveResult = await await removeFromTree(
    stage,
    parents.repository,
    basename,
  );
  if (repoRemoveResult instanceof Error) {
    return repoRemoveResult;
  }

  const stageRemoveResult = await removeFromTree(
    stage,
    parents.stage,
    basename,
  );
  if (stageRemoveResult instanceof Error) {
    return stageRemoveResult;
  }

  return {
    repository: repoRemoveResult,
    stage: stageRemoveResult,
  };
}

async function removeFromTree(
  primitive: Pick<RepositoryPrimitives, 'removeFromTree'>,
  parents: PathTreeObject[] | null,
  name: string,
): Promise<PathTreeObject[] | null | Error> {
  if (parents == null) {
    return null;
  }

  return await primitive.removeFromTree(parents, name);
}
