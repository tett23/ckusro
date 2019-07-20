import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import rmrf from '../utils/rmrf';

export default async function clearStage(config: CkusroConfig, fs: typeof FS) {
  const rmrfResult = await rmrf(fs, config.stage);
  if (rmrfResult instanceof Error) {
    return rmrfResult;
  }

  return true;
}
