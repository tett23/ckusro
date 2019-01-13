import 'core-js/fn/array/flat-map';
import cli from './cli/index';

export default async function main(argv: string[]) {
  return await cli(argv);
}
