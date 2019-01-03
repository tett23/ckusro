import 'core-js/fn/array/flat-map';
import { CkusroConfig, mergeConfig } from './config';
import staticRenderer from './staticRenderer';

export default async function main(config: CkusroConfig) {
  return await staticRenderer(config);
}

const conf = mergeConfig({});
main(conf);
