import buildAst from '../src/Parser/buildAst';
import { buildCkusroConfig } from './__fixtures__';

describe('Parser', () => {
  it('', () => {
    const config = buildCkusroConfig();
    const actual = buildAst(config.plugins, 'test');

    expect(actual).toMatchSnapshot();
  });
});
