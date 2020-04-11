import {
  buildCkusroConfig,
  buildRepoPath,
  buildUnpersistedGitObject,
} from '../__fixtures__';
import {
  buildDummyRepository,
  DummyRepositoryResult,
} from '../__fixtures__/buildDummyRepository';
import { objectDigest } from '../../src/models/GitObject/digest';
import batchWriteObjects from '../../src/RepositoryPrimitives/batchWriteObjects';

describe(batchWriteObjects, () => {
  const config = buildCkusroConfig();
  const repoPath = buildRepoPath();

  it('returns GitObject[]', async () => {
    const { repository } = (await buildDummyRepository(
      config,
      repoPath,
    )) as DummyRepositoryResult;
    const object = buildUnpersistedGitObject({
      type: 'blob',
      content: Buffer.from('test'),
    });
    const actual = await repository.batchWriteObjects([object]);

    expect(actual).not.toBeInstanceOf(Error);
    expect(actual).toEqual([{ ...object, oid: await objectDigest(object) }]);
  });
});
