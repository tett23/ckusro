import { buildAst } from '../../src/parser';

describe(buildAst, () => {
  it('builds AST', () => {
    const actual = buildAst('# hoge');
    const expected = {
      children: [
        {
          children: [
            {
              position: {
                end: { column: 7, line: 1, offset: 6 },
                indent: [],
                start: { column: 3, line: 1, offset: 2 },
              },
              type: 'text',
              value: 'hoge',
            },
          ],
          depth: 1,
          position: { end: { column: 7, line: 1, offset: 6 }, indent: [], start: { column: 1, line: 1, offset: 0 } },
          type: 'heading',
        },
      ],
      position: { end: { column: 7, line: 1, offset: 6 }, start: { column: 1, line: 1, offset: 0 } },
      type: 'root',
    };

    expect(actual).toEqual(expected);
  });
});
