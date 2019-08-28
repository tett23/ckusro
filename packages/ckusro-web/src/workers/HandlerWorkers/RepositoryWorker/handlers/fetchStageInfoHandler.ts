import ckusroCore, {
  CkusroConfig,
  separateErrors,
  GitObject,
} from '@ckusro/ckusro-core';
import FS from 'fs';
import { addObjects, updateStageHead } from '../../../../modules/domain';
import { fetchStageInfo } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';

export default async function fetchStageInfoHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof fetchStageInfo>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const tree = await stage.headTreeObject();
  if (tree instanceof Error) {
    return tree;
  }

  const result = await stage.lsFiles();
  if (result instanceof Error) {
    return result;
  }

  const ps = result.map(([, item]) => stage.fetchByOid(item.oid));
  const results = await Promise.all(ps);
  const [maybeNull, errors] = separateErrors(results);
  if (errors.length !== 0) {
    return errors[0];
  }

  const objects = maybeNull.filter((item): item is GitObject => item != null);

  return [addObjects(objects), updateStageHead(tree.oid)];
}
