import { Stage } from '../../Stage';
import { Repository } from '../../Repository';
import { InternalPath, createInternalPath } from '../../models/InternalPath';
import primitiveFetchParents from '../../RepositoryPrimitives/internal/fetchParents';
import { PathTreeObject, WithStageParents } from '../../models/PathTreeObject';

export default async function fetchParentsByInternalPath(
  repository: Repository,
  stage: Stage,
  internalPath: InternalPath,
): Promise<WithStageParents | Error> {
  const repoParents = await repositoryParents(repository, internalPath);
  if (repoParents instanceof Error) {
    return repoParents;
  }

  const sParents = await stageParents(stage, internalPath);
  if (sParents instanceof Error) {
    return sParents;
  }

  return {
    repository: repoParents,
    stage: sParents,
  };
}

async function repositoryParents(
  repository: Repository,
  internalPath: InternalPath,
): Promise<PathTreeObject[] | Error> {
  const repoHeadTreeObject = await repository.headTreeObject();
  if (repoHeadTreeObject instanceof Error) {
    return repoHeadTreeObject;
  }

  return primitiveFetchParents(
    repository.config(),
    repoHeadTreeObject,
    internalPath.path,
    {
      create: false,
    },
  );
}

async function stageParents(
  stage: Stage,
  internalPath: InternalPath,
): Promise<PathTreeObject[] | Error> {
  const repoHeadTreeObject = await stage.headTreeObject();
  if (repoHeadTreeObject instanceof Error) {
    return repoHeadTreeObject;
  }

  return primitiveFetchParents(
    stage.config(),
    repoHeadTreeObject,
    createInternalPath(internalPath).flat(),
    {
      create: false,
    },
  );
}
