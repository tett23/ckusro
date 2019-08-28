import {
  RepoPath,
  CkusroCore,
  GitObject,
  separateErrors,
} from '@ckusro/ckusro-core';
import { HandlersResult } from '../../../../handleAction';
import { RepositoryWorkerResponseActions } from '../../index';
import { addObjects, updateStageHead } from '../../../../../modules/domain';

export default async function checkout(
  core: CkusroCore,
  repoPath: RepoPath,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const checkoutResult = await stage.checkout(repoPath, 'HEAD');
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }
  const { root } = checkoutResult;
  const commitResult = await stage.commit(root, 'updated');
  if (commitResult instanceof Error) {
    return commitResult;
  }

  const items = await stage.lsFilesByTree(root);
  if (items instanceof Error) {
    return items;
  }

  const ps = items.map((item) => stage.fetchByOid(item[1].oid));
  const [nullableObjects, errors] = separateErrors(await Promise.all(ps));
  if (errors.length !== 0) {
    return errors[0];
  }

  const objects = nullableObjects.filter(
    (item): item is GitObject => item != null,
  );

  return [addObjects([...objects, root]), updateStageHead(commitResult.oid)];
}
