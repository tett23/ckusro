import { CkusroFile, CkusroId } from './ckusroFile';

export type DependencyTable = {
  [key: string]: {
    weakDependencies: CkusroId[];
    strongDependencies: CkusroId[];
  };
};

export function buildDependencyTable(files: CkusroFile[]): DependencyTable {
  return files.reduce((acc: DependencyTable, file) => {
    const strongDependencies = file.strongDependencies.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });
    const weakDependencies = file.weakDependencies.flatMap((id) => {
      const f = files.find((item) => id === item.id);

      return f != null ? [f.id] : [];
    });

    acc[file.id] = {
      weakDependencies,
      strongDependencies,
    };

    return acc;
  }, {});
}

export function invert(table: DependencyTable): DependencyTable {
  return Object.entries(table).reduce(
    (acc: DependencyTable, [id, { weakDependencies, strongDependencies }]) => {
      acc[id] = acc[id] || {
        weakDependencies: [],
        strongDependencies: [],
      };

      weakDependencies.forEach((refId) => {
        acc[refId] = acc[refId] || {
          weakDependencies: [],
          strongDependencies: [],
        };

        acc[refId].weakDependencies.push(id);
      });

      strongDependencies.forEach((refId) => {
        acc[refId] = acc[refId] || {
          weakDependencies: [],
          strongDependencies: [],
        };

        acc[refId].strongDependencies.push(id);
      });

      return acc;
    },
    {},
  );
}
