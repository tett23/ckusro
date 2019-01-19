import 'core-js/fn/array/flat-map';
import 'core-js/fn/array/flatten';
import cli from './cli/index';

export default async function main(argv: string[]) {
  return await cli(argv);
}
