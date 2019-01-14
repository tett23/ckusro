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
      ignoreInitial: true,
      disableGlobbing: true,
      depth: 0,
    });
    let isRunning = false;

    watcher
      .on('add', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }

        watcher.add(path);
      })
      .on('change', () => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }
      })
      .on('unlink', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }

        watcher.unwatch(path);
      })
      .on('addDir', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }

        watcher.add(path);
      })
      .on('unlinkDir', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }

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
  console.time('handleChange');

  return reload(globalState)
    .then((res) => {
      if (res instanceof Error) {
        reject();
      }

      console.timeEnd('handleChange');
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

  const paths = globalState.files.map(({ namespace, path }) => {
    const context = loaderContextMap[namespace];

    return join(context.path, path);
  });

  const outputPaths = globalState.outputContexts.map((item) => item.path);
  return paths.filter((item) => {
    return !outputPaths.some((outputPath) => item.includes(outputPath));
  });
}
