import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import rmrf from '../utils/rmrf';

export default function removeAllRepositories(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<true | Error> {
  return rmrf(fs, config.base);
}
