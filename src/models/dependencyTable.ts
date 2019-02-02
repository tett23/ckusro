import { isNonNullObject, isPropertyValidTypeOf } from '../core/utils/types';
import { FileBuffer, isFileBufferIds } from './FileBuffer';

export type DependencyTable = {
  [key: string]: {
    name: string[];
    content: string[];
  };
};

export function isDependencyTable(obj: unknown): obj is DependencyTable {
  if (!isNonNullObject(obj)) {
    return false;
  }

  return Object.entries(obj as DependencyTable).every(([k, v]) => {
    if (typeof k !== 'string') {
      return false;
    }

    return (
      isPropertyValidTypeOf(v, 'name', isFileBufferIds) &&
      isPropertyValidTypeOf(v, 'content', isFileBufferIds)
    );
  });
}

export function buildDependencyTable(files: FileBuffer[]): DependencyTable {
  return files.reduce((acc: DependencyTable, file) => {
    const nameDependencies = file.dependencies.name.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });
    const contentDependencies = file.dependencies.content.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });

    acc[file.id] = {
      name: nameDependencies,
      content: contentDependencies,
    };

    return acc;
  }, {});
}

export function invert(table: DependencyTable): DependencyTable {
  return Object.entries(table).reduce(
    (acc: DependencyTable, [id, { name, content }]) => {
      acc[id] = acc[id] || {
        weakDependencies: [],
        strongDependencies: [],
      };

      name.forEach((refId) => {
        acc[refId] = acc[refId] || {
          weakDependencies: [],
          strongDependencies: [],
        };

        acc[refId].name.push(id);
      });

      content.forEach((refId) => {
        acc[refId] = acc[refId] || {
          weakDependencies: [],
          strongDependencies: [],
        };

        acc[refId].content.push(id);
      });

      return acc;
    },
    {},
  );
}
