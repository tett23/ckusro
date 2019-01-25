import fs from 'fs';
import { join as joinPath } from 'path';
import { promisify } from 'util';
import { LoaderConfig } from '../models/ckusroConfig/LoaderConfig';
import {
  CkusroFile,
  FileTypeDirectory,
  newCkusroFile,
} from '../models/ckusroFile';
import { LoaderContext, loaderContextMap } from '../models/loaderContext';
import { Plugins } from '../models/plugins';
import { buildAst, determineDependency } from '../parser';
import { separateErrors } from '../utils/errors';
import { isErrors } from '../utils/types';
import checkLoaderContexts from './checkLoaderContexts';
import fetchEntries from './fetchEntries';

const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);

export default async function fileLoader(
  contexts: LoaderContext[],
  loaderConfig: LoaderConfig,
  plugins: Plugins,
): Promise<CkusroFile[] | Error[]> {
  const contextErrors = await checkLoaderContexts(contexts);
  if (isErrors(contextErrors)) {
    return contextErrors;
  }

  const files = await buildFiles(contexts, loaderConfig);
  if (isErrors(files)) {
    return files;
  }

  const contextMap = loaderContextMap(contexts);
  const ps = files
    .map(
      (file): [LoaderContext, CkusroFile] => {
        return [contextMap[file.namespace], file];
      },
    )
    .map((args) => loadContent(...args));

  const contentLoaded = await Promise.all(ps);
  return contentLoaded
    .map(
      (file): [LoaderContext, CkusroFile] => {
        return [contextMap[file.namespace], file];
      },
    )
    .map(([context, file]) =>
      loadDependencies(plugins, context, file, contentLoaded),
    );
}

export async function buildFiles(
  contexts: LoaderContext[],
  loaderConfig: LoaderConfig,
): Promise<CkusroFile[] | Error[]> {
  const entries = await fetchEntries(contexts, loaderConfig);
  if (isErrors(entries)) {
    return entries;
  }

  const ps = entries.map(([context, path]) =>
    newCkusroFile(lstat, context, path),
  );
  const [ret, errors] = separateErrors(await Promise.all(ps));
  if (isErrors(errors)) {
    return errors;
  }

  return ret;
}

export async function loadContent(
  context: LoaderContext,
  file: CkusroFile,
): Promise<CkusroFile> {
  if (file.fileType === FileTypeDirectory) {
    return Object.assign({}, file, {
      isLoaded: true,
      content: null,
    });
  }

  const content = await readFile(joinPath(context.path, file.path)).catch(
    () => null,
  );
  if (content == null) {
    return Object.assign({}, file, {
      isLoaded: true,
      content: null,
    });
  }

  const merge: Partial<CkusroFile> = {
    isLoaded: true,
    content: content.toString(),
  };
  return Object.assign({}, file, merge);
}

export function loadDependencies(
  plugins: Plugins,
  context: LoaderContext,
  file: CkusroFile,
  files: CkusroFile[],
): CkusroFile {
  if (!file.isLoaded) {
    return file;
  }

  const rootNode = buildAst(plugins, file.content || '');
  const dependencyFiles = determineDependency(context, rootNode, files);

  return Object.assign({}, file, {
    weakDependencies: dependencyFiles.map(({ id }) => id),
    strongDependencies: dependencyFiles.map(({ id }) => id),
  });
}
