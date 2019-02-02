import { FileBuffer, FileBufferDependency } from '../../../models/FileBuffer';
import { Plugins } from '../../../models/plugins';
import { buildAst, determineDependency } from '../../../parser';

export default function loadDependencies(
  plugins: Plugins,
  file: FileBuffer,
  files: FileBuffer[],
): FileBuffer {
  if (typeof file.content !== 'string') {
    return file;
  }

  const rootNode = buildAst(plugins, file.content || '');
  const dependencyFiles = determineDependency(file.namespace, rootNode, files);

  const dependencies: FileBufferDependency = {
    name: dependencyFiles.map(({ id }) => id),
    content: dependencyFiles.map(({ id }) => id),
  };
  const overrides: Partial<FileBuffer> = {
    dependencies,
  };

  return Object.assign({}, file, overrides);
}
