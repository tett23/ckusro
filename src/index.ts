import 'core-js/modules/esnext.array.flat';
import 'core-js/modules/esnext.array.flat-map';
import cli from './cli/index';
import { isErrors } from './core/utils/types';

export default async function main(argv: string[]) {
  const result = await cli(argv);
  if (isErrors(result)) {
    result.map((err) => {
      console.error(err.name);
      console.error(err.message);
      console.error(err.stack);
    });
  }
}
