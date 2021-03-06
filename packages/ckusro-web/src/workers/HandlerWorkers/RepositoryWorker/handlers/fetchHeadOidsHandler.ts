import ckusroCore, {
  CkusroConfig,
  OidRepoPath,
  separateErrors,
} from '@ckusro/ckusro-core';
import FS from 'fs';
import { addRef } from '../../../../modules/domain';
import { HandlersResult } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';

export default async function fetchHeadOidsHandler(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const results = await core.repositories().headOids();
  const [heads, errors] = separateErrors(results as Array<OidRepoPath | Error>);
  if (errors.length !== 0) {
    return errors[0];
  }

  return heads.map(([oid, repoPath]) => {
    return addRef({
      repoPath,
      name: 'HEAD',
      oid,
    });
  });
}
