import { CkusroFile, CkusroId } from './ckusroFile';

export type DependencyTable = {
  [key: string]: {
    weakDependencies: CkusroId[];
    strongDependencies: CkusroId[];
  };
};

type RefTuple = [CkusroId, CkusroId[], CkusroId[]];

export function buildDependencyTable(files: CkusroFile[]): DependencyTable {
  const depMap = buildDepMap(files);

  return depMap.reduce((acc: DependencyTable, [id, weak, strong]) => {
    acc[id] = { weakDependencies: weak, strongDependencies: strong };
    return acc;
  }, {});
}

function buildDepMap(files: CkusroFile[]): RefTuple[] {
  return files.map(({ id }) => id).map((id) => buildDependency(id, files));
}

export function buildDependency(id: CkusroId, files: CkusroFile[]): RefTuple {
  const weak = weakDependencies(id, files);
  const strong = strongDependencies(id, files);

  return [id, weak, strong];
}

function weakDependencies(id: CkusroId, files: CkusroFile[]) {
  return files.flatMap(({ id: refId, weakDependencies: deps }) => {
    if (!deps.includes(id)) {
      return [];
    }

    return [refId];
  });
}

function strongDependencies(id: CkusroId, files: CkusroFile[]) {
  return files.flatMap(({ id: refId, strongDependencies: deps }) => {
    if (!deps.includes(id)) {
      return [];
    }

    return [refId];
  });
}
