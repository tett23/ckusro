import FS from 'fs';
import { Volume } from 'memfs';
import pify from 'pify';
import { Union } from 'unionfs';

export function pfs(): typeof FS {
  const volume = Volume.fromJSON({});

  const ufs = new Union();
  ufs.use(volume);

  ufs.promises = pify(ufs);

  return ufs;
}
