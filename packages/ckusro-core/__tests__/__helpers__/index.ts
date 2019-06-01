import fs from 'fs';
import { Volume } from 'memfs';
import { Union } from 'unionfs';
import { CkusroConfig } from '../../src/models/CkusroConfig';

export function pfs(config: CkusroConfig): typeof fs {
  const volume = Volume.fromJSON({});
  volume.mkdirSync(config.base);

  const ufs = new Union();
  ufs.use(volume);

  return ufs;
}
