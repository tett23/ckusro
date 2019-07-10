import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import revParse from './revParse';

export default async function headOid(
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  return revParse(config, 'origin/HEAD');
}
