import { buildCkusroConfig } from '../../__fixtures__';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import {
  buildDummyRepository,
  DummyRepositoryResult,
} from '../../__fixtures__/buildDummyRepository';
import { buildInternalPath } from '../../__fixtures__';
import replaceTreeNode from '../../../src/RepositoryPrimitives/internal/replaceTreeNode';
import buildTreeFromTreeLike, {
  BuildTreeFromObjectResult,
} from '../../../src/models/GitObject/buildTreeFromTreeLike';
import { printTree2 } from '../../__helpers__/printTree';
import batchWriteObjects from '../../../src/RepositoryPrimitives/batchWriteObjects';
import { BlobObject, TreeObject } from '../../../src';

describe(replaceTreeNode, () => {
  const config = buildCkusroConfig();

  it('returns PathTreeObject[]', async () => {
    const internalPath = buildInternalPath();
    const { repository, isoConfig } = (await buildDummyRepository(
      config,
      internalPath.repoPath,
      {
        initialTree: {
          'foo/bar': '',
        },
      },
    )) as DummyRepositoryResult;

    const { objects } = buildTreeFromTreeLike({
      'foo/bar': 'updated',
    }) as BuildTreeFromObjectResult;
    await batchWriteObjects(isoConfig, objects);

    expect(
      await printTree2(
        (await repository.headTreeObject()) as TreeObject,
        repository.fetchByOid,
      ),
    ).toMatchInlineSnapshot(`
                  "foo(d87cbc)
                    bar(e69de2)"
            `);

    const [[, newRoot]] = (await replaceTreeNode(
      isoConfig,
      '/foo/bar',
      objects.find((item) => item.type === 'blob') as BlobObject,
    )) as PathTreeObject[];

    expect(await printTree2(newRoot, repository.fetchByOid))
      .toMatchInlineSnapshot(`
                        "foo(358874)
                          bar(f55556)"
                `);
  });

  it('returns PathTreeObject[] when the path is root', async () => {
    const internalPath = buildInternalPath();
    const { repository, isoConfig } = (await buildDummyRepository(
      config,
      internalPath.repoPath,
    )) as DummyRepositoryResult;

    const { root: replace } = buildTreeFromTreeLike({
      updated: '',
    }) as BuildTreeFromObjectResult;
    const [[, newRoot]] = (await replaceTreeNode(
      isoConfig,
      '/',
      replace,
    )) as PathTreeObject[];

    expect(
      await printTree2(newRoot, repository.fetchByOid),
    ).toMatchInlineSnapshot(`"updated(e69de2)"`);
  });
});
