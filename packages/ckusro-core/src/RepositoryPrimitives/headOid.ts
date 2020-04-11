import FS from 'fs';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import revParse from './revParse';

export default async function headOid(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  return revParse(fs, config, 'HEAD');
}
