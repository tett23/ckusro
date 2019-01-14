import chokidar from 'chokidar';
import { join } from 'path';
import { GlobalState, reloadFiles } from '../models/globalState';
import { LoaderContext } from '../models/loaderContext';
import staticRenderer from '../staticRenderer';

export async function buildHandler(globalState: GlobalState) {
  return await staticRenderer(globalState);
}

export async function watchHandler(globalState: GlobalState): Promise<boolean> {
  const paths = absolutePaths(globalState);
  const promise = new Promise((_, reject) => {
    const watcher = chokidar.watch(paths, {
      ignored: '**/node_modules/**',
    });

    watcher
      .on('raw', (event, path, details) => {
        console.info('raw', event, path, details);
      })
      .on('add', (path) => {
        console.info('add', path);

        handleChange(globalState, reject);

        watcher.add(path);
      })
      .on('change', (path) => {
        console.info('change', path);

        handleChange(globalState, reject);
      })
      .on('unlink', (path) => {
        console.info('unlink', path);

        handleChange(globalState, reject);

        watcher.unwatch(path);
      })
      .on('addDir', (path) => {
        console.info('addDir', path);

        handleChange(globalState, reject);

        watcher.add(path);
      })
      .on('unlinkDir', (path) => {
        console.info('unlinkDir', path);

        handleChange(globalState, reject);

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

function handleChange(globalState: GlobalState, reject: any) {
  reload(globalState)
    .then((res) => {
      if (res instanceof Error) {
        reject();
      }
    })
    .catch(() => reject());
}

async function reload(state: GlobalState) {
  const newState = await reloadFiles(state);
  if (newState instanceof Error) {
    return newState;
  }

  return await staticRenderer(newState);
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
