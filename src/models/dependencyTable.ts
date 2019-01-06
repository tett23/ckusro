import { CkusroFile, CkusroId } from './ckusroFile';

export type DependencyTable = {
  [key: string]: {
    weakDependencies: CkusroId[];
    strongDependencies: CkusroId[];
  };
};

type RefTuple = [string, string[], string[]];

export function buildDependencyTable(files: CkusroFile[]): DependencyTable {
  const depMap = files.map(
    ({ id }): RefTuple => {
      const weak = files.flatMap(({ id: refId, weakDependencies }) => {
        if (!weakDependencies.includes(id)) {
          return [];
        }

        return [refId];
      });
      const strong = files.flatMap(({ id: refId, strongDependencies }) => {
        if (!strongDependencies.includes(id)) {
          return [];
        }

        return [refId];
      });

      return [id, weak, strong];
    },
  );

  return depMap.reduce((acc: DependencyTable, [id, weak, strong]) => {
    acc[id] = { weakDependencies: weak, strongDependencies: strong };
    return acc;
  }, {});
}
