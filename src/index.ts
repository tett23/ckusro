import 'core-js/fn/array/flat-map';
import { CkusroConfig, mergeConfig } from './config';
import render from './staticRenderer';

export default async function main(config: CkusroConfig) {
  return await render(config);
}

const conf = mergeConfig({});
main(conf);
