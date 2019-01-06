import 'core-js/fn/array/flat-map';
import cli from './config/cli';
import newGlobalState from './models/globalState';
import staticRenderer from './staticRenderer';

export default async function main(argv: string[]) {
  const conf = cli(argv);
  const globalState = await newGlobalState(conf);
  if (globalState instanceof Error) {
    return globalState;
  }

  return await staticRenderer(globalState);
}
