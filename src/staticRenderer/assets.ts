import webpack from 'webpack';
import { assetsDirectory, GlobalState } from '../models/OldGlobalState';
import config from './webpack.config';

export function jsAssets(globalState: GlobalState): Promise<true | Error> {
  const promise: Promise<true | Error> = new Promise((resolve) => {
    const compiler = webpack({
      ...config,
      mode: 'production',
      output: {
        path: assetsDirectory(globalState),
      },
    });
    compiler.run((err, stats) => {
      if (err != null) {
        resolve(err);
        return;
      }

      const info = stats.toJson();
      if (stats.hasWarnings()) {
        info.warnings.forEach((item: string) => console.info(item));
      }

      if (stats.hasErrors()) {
        info.errors.forEach((item: string) => console.info(item));
        resolve(new Error('webpack error.'));
      }

      resolve(true);
    });
  });

  return promise;
}
