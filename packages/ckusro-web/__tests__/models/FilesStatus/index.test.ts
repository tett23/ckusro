import { createFilesStatus } from '../../../src/models/FilesStatus';
import {
  buildInternalPathEntry,
  buildInternalPath,
  buildTreeEntry,
} from '../../__fixtures__';
import { PathManager } from '../../../src/models/PathManager';

describe(createFilesStatus, () => {
  it('returns MergedPathManagerChangedItem when item changed', () => {
    const internalPath = buildInternalPath();
    const originalTreeEntry = buildTreeEntry();
    const internalPathEntry = buildInternalPathEntry(
      internalPath,
      originalTreeEntry,
    );
    const repoPathManager: PathManager = [internalPathEntry];
    const changedTreeEntry = buildTreeEntry({
      ...originalTreeEntry,
      oid: 'changed',
    });
    const stagePathManager: PathManager = [
      buildInternalPathEntry(internalPath, changedTreeEntry),
    ];
    const actual = createFilesStatus(repoPathManager, stagePathManager);

    expect(actual).toEqual([
      {
        internalPath,
        originalOid: originalTreeEntry.oid,
        changedOid: changedTreeEntry.oid,
        flag: 'changed',
      },
    ]);
  });

  it('returns MergedPathManagerNoChangedItem when item does not changed', () => {
    const internalPath = buildInternalPath();
    const originalTreeEntry = buildTreeEntry();
    const internalPathEntry = buildInternalPathEntry(
      internalPath,
      originalTreeEntry,
    );
    const repoPathManager: PathManager = [internalPathEntry];
    const stagePathManager: PathManager = repoPathManager;
    const actual = createFilesStatus(repoPathManager, stagePathManager);

    expect(actual).toEqual([
      {
        internalPath,
        originalOid: originalTreeEntry.oid,
        changedOid: null,
        flag: 'nochanged',
      },
    ]);
  });

  it('returns MergedPathManagerAddedItem when item added', () => {
    const repoPathManager: PathManager = [];
    const internalPath = buildInternalPath();
    const treeEntry = buildTreeEntry();
    const internalPathEntry = buildInternalPathEntry(internalPath, treeEntry);
    const stagePathManager: PathManager = [internalPathEntry];
    const actual = createFilesStatus(repoPathManager, stagePathManager);

    expect(actual).toEqual([
      {
        internalPath,
        originalOid: null,
        changedOid: treeEntry.oid,
        flag: 'added',
      },
    ]);
  });
});
