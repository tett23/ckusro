import { isNonNullObject, isPropertyValidTypeOf } from '../core/utils/types';
import { FileBuffer, FileBufferId, isFileBufferIds } from './FileBuffer';

export type Dependency = {
  name: FileBufferId[];
  content: FileBufferId[];
};

export function isDependency(v: unknown): v is Dependency {
  if (!isNonNullObject(v)) {
    return false;
  }

  const obj = v as Dependency;

  return (
    isPropertyValidTypeOf(obj, 'name', isFileBufferIds) &&
    isPropertyValidTypeOf(obj, 'content', isFileBufferIds)
  );
}

export type DependencyTable = {
  [key: string]: Dependency;
};

export function isDependencyTable(obj: unknown): obj is DependencyTable {
  if (!isNonNullObject(obj)) {
    return false;
  }

  return Object.entries(obj as DependencyTable).every(([k, v]) => {
    if (typeof k !== 'string') {
      return false;
    }

    return isDependency(v);
  });
}

export function buildDependencyTable(files: FileBuffer[]): DependencyTable {
  return files.reduce((acc: DependencyTable, file) => {
    const name = file.dependencies.name.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });
    const content = file.dependencies.content.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });

    acc[file.id] = {
      name,
      content,
    };

    return acc;
  }, {});
}

export function invert(table: DependencyTable): DependencyTable {
  return Object.entries(table).reduce(
    (acc: DependencyTable, [id, { name, content }]) => {
      acc[id] =
        acc[id] ||
        ({
          name: [],
          content: [],
        } as Dependency);

      name.forEach((refId) => {
        acc[refId] =
          acc[refId] ||
          ({
            name: [],
            content: [],
          } as Dependency);

        acc[refId].name.push(id);
      });

      content.forEach((refId) => {
        acc[refId] =
          acc[refId] ||
          ({
            name: [],
            content: [],
          } as Dependency);

        acc[refId].content.push(id);
      });

      return acc;
    },
    {},
  );
}

export function allDepdendencies(dependency: Dependency): FileBufferId[] {
  const { name, content } = dependency;

  return name.concat(content);
}
