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
  const [weak, strong] = files
    .map(
      ({
        id: refId,
        strongDependencies,
        weakDependencies,
      }): [CkusroId[], CkusroId[]] => {
        return [
          dependency(id, refId, weakDependencies),
          dependency(id, refId, strongDependencies),
        ];
      },
    )
    .flatMap(([w, s]) => [w, s]);

  return [id, weak, strong];
}

function dependency(
  id: CkusroId,
  refId: CkusroId,
  deps: CkusroId[],
): CkusroId[] {
  if (!deps.includes(id)) {
    return [];
  }

  return [refId];
}
