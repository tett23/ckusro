import 'core-js/fn/array/flat-map';
import { mergeConfig } from './config';
import { CkusroConfig } from './models/ckusroConfig';
import staticRenderer from './staticRenderer';

export default async function main(config: CkusroConfig) {
  return await staticRenderer(config);
}

const conf = mergeConfig({});
main(conf);
