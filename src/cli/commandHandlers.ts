import chokidar from 'chokidar';
import { join } from 'path';
import { GlobalState } from '../models/globalState';
import { LoaderContext } from '../models/loaderContext';
import staticRenderer from '../staticRenderer';

export async function buildHandler(globalState: GlobalState) {
  return await staticRenderer(globalState);
}

export async function watchHandler(globalState: GlobalState): Promise<boolean> {
  const paths = absolutePaths(globalState);
  const promise = new Promise((_, reject) => {
    const watcher = chokidar.watch(paths);
    watcher
      .on('raw', (event, path, details) => {
        console.info('raw', event, path, details);
      })
      .on('add', (path) => {
        console.info('add', path);
        watcher.add(path);
      })
      .on('change', (path) => {
        console.info('change', path);
      })
      .on('unlink', (path) => {
        console.info('unlink', path);
        watcher.unwatch(path);
      })
      .on('addDir', (path) => {
        console.info('addDir', path);
      })
      .on('unlinkDir', (path) => {
        console.info('unlinkDir', path);
        watcher.unwatch(path);
      })
      .on('ready', () => {
        console.info('ready');
      })
      .on('error', (err) => {
        console.error(err);
        reject();
      });
  })
    .then(() => true)
    .catch(() => false);

  return await promise;
}

function absolutePaths(globalState: GlobalState): string[] {
  const loaderContextMap = globalState.loaderContexts.reduce(
    (acc, ns) => {
      acc[ns.name] = ns;

      return acc;
    },
    {} as { [key in string]: LoaderContext },
  );

  return globalState.files.map(({ namespace, path }) => {
    const context = loaderContextMap[namespace];

    return join(context.path, path);
  });
}
