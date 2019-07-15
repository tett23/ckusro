import { buildRepoPath } from '../../__fixtures__';
import { createRepoPath } from '../../../src';
import pathToInternalPath from '../../../src/Stage/internal/pathToInternalPath';

describe(pathToInternalPath, () => {
  it('returns InternalPath', async () => {
    const repoPath = buildRepoPath();
    const path = createRepoPath(repoPath).join() + '/foo';
    const actual = pathToInternalPath([repoPath], path);

    expect(actual).toMatchObject({
      repoPath,
      path: '/foo',
    });
  });

  it('returns null', async () => {
    const repoPath = buildRepoPath();
    const path =
      createRepoPath(buildRepoPath({ name: 'does_not_exist' })).join() + '/foo';
    const actual = pathToInternalPath([repoPath], path);

    expect(actual).toBe(null);
  });
});
