import 'core-js/modules/esnext.array.flat';
import 'core-js/modules/esnext.array.flat-map';
import cli from './cli/index';

export default async function main(argv: string[]) {
  return await cli(argv);
}
