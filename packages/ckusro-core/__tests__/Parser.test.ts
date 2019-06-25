import buildAst from '../src/Parser/buildAst';
import { buildCkusroConfig } from './__fixtures__';

describe('Parser', () => {
  it('', async () => {
    const config = buildCkusroConfig();
    const actual = await buildAst(config.plugins, 'test');

    expect(actual).toMatchSnapshot();
  });
});
