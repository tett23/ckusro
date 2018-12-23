import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import unified from 'unified';
import wikiLink, { locator, Options } from '../../src/parser/wikiLink';

function jsxCompiler() {
  // @ts-ignore
  this.Compiler.prototype.visitors.jsx = (node: any) => node.value;
}

const parse = (mdx: string, options?: Partial<Options>): any => {
  const result = unified()
    .use(remarkParse)
    .use(wikiLink, options)
    .use(remarkStringify)
    .use(jsxCompiler)
    .processSync(mdx);

  return result.contents;
};

describe(wikiLink, () => {
  it('parses wikiLink', () => {
    const result = parse('[[foo]]');

    expect(result.trim()).toEqual(
      '<WikiLink linkTarget="foo" className="">foo</WikiLink>',
    );
  });

  it('appends className', () => {
    const result = parse('[[foo]]', { className: 'test' });

    expect(result.trim()).toEqual(
      '<WikiLink linkTarget="foo" className="test">foo</WikiLink>',
    );
  });

  it('displays alias textg when wrote with pipe', () => {
    const result = parse('[[foo|bar]]');

    expect(result.trim()).toEqual(
      '<WikiLink linkTarget="foo" className="">bar</WikiLink>',
    );
  });

  it('nothing to do when text is srrounded by single bracket', () => {
    const result = parse('[foo]');

    expect(result.trim()).toEqual('[foo]');
  });

  it('', () => {
    const result = parse('[[foo]][[bar]]');

    expect(result.trim()).toEqual(
      '<WikiLink linkTarget="foo" className="">foo</WikiLink><WikiLink linkTarget="bar" className="">bar</WikiLink>',
    );
  });

  // TODO: fix
  it('', () => {
    const result = parse('[[inline|foo]]');

    expect(result.trim()).toEqual(
      '<WikiLink linkTarget="inline" className="">foo</WikiLink>',
    );
  });
});

it('', () => {
  const result = parse('foo[[bar]]baz');

  expect(result.trim()).toEqual(
    'foo<WikiLink linkTarget="bar" className="">bar</WikiLink>baz',
  );
});

describe(locator, () => {
  it('returns number', () => {
    const data: Array<[string, number, number]> = [
      ['[[foo]]', 0, 0],
      ['[[ns:foo]]', 0, 0],
      ['[[foo|bar]]', 0, 0],
      ['foo', 0, -1],
      ['[[foo]]bar', 0, 0],
      ['foo[[bar]]', 0, 3],
      ['foo[[bar]]baz', 0, 3],
    ];

    data.forEach((item) => {
      const [text, fromIndex, expected] = item;
      const actual = locator(text, fromIndex);

      expect(actual).toBe(expected);
    });
  });
});
