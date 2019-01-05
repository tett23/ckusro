import 'core-js/fn/array/flat-map';
import cli from './config/cli';
import staticRenderer from './staticRenderer';

export default async function main(argv: string[]) {
  const conf = cli(argv);
  return await staticRenderer(conf);
}
