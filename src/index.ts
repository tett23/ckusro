import 'core-js/fn/array/flat-map';
import cli from './cli/index';
import fromCLIOptions from './config/cli';
import newGlobalState from './models/globalState';
import staticRenderer from './staticRenderer';

export default async function main(argv: string[]) {
  const options = cli(argv);
  const conf = fromCLIOptions(options);
  const globalState = await newGlobalState(conf);
  if (globalState instanceof Error) {
    return globalState;
  }

  return await staticRenderer(globalState);
}
