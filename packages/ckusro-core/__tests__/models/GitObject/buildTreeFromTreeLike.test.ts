import buildTreeFromTreeLike, {
  BuildTreeFromObjectResult,
} from '../../../src/models/GitObject/buildTreeFromTreeLike';
import printTree from '../../__helpers__/printTree';

describe(buildTreeFromTreeLike, () => {
  it('returns root TreeObject and GitObjects', () => {
    const actual = buildTreeFromTreeLike({
      'foo/bar': '',
      'foo/a': '',
      'foo/b/c': '',
      foo: {
        bar: {
          'baz.txt': '',
        },
      },
      'hoge/fuga': {
        piyo: '',
      },
      empty: {},
    }) as BuildTreeFromObjectResult;

    expect(printTree(actual.root, actual.objects)).toMatchInlineSnapshot(`
      "foo(80f568)
        bar(34707b)
          baz.txt(e69de2)
        a(e69de2)
        b(587ff0)
          c(e69de2)
      hoge(ffac77)
        fuga(98f6fe)
          piyo(e69de2)"
    `);
  });

  it('returns Error when passed empty TreeContentLike', () => {
    const actual = buildTreeFromTreeLike({}) as BuildTreeFromObjectResult;

    expect(actual).toBeInstanceOf(Error);
  });
});
