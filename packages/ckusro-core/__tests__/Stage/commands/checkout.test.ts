import { buildCkusroConfig, buildRepoPath } from '../../__fixtures__';
import checkout, { CheckoutResult } from '../../../src/Stage/commands/checkout';
import {
  buildDummyRepository,
  buildDummyStage,
  DummyRepositoryResult,
  DummyStageResult,
} from '../../__fixtures__/buildDummyRepository';
import { printTree2 } from '../../__helpers__/printTree';

describe(checkout, () => {
  const config = buildCkusroConfig();
  const repoPath = buildRepoPath();

  it('returns TreeObject', async () => {
    const { fs } = (await buildDummyRepository(config, repoPath, {
      initialTree: {
        hoge: {
          fuga: '',
        },
        'foo/bar/baz': '',
      },
    })) as DummyRepositoryResult;
    const { repository: stage } = (await buildDummyStage(config, {
      fs: fs,
    })) as DummyStageResult;

    const { root: newRoot } = (await stage.checkout(
      repoPath,
      'HEAD',
    )) as CheckoutResult;

    expect(await printTree2(newRoot, stage.fetchByOid)).toMatchInlineSnapshot(`
      ".gitkeep(e69de2)
      example.com(c7ca84)
        tett23(e58fd1)
          test(1a882c)
            foo(b6bcad)
              bar(94b297)
                baz(e69de2)
            hoge(c6e991)
              fuga(e69de2)"
    `);
  });
});
