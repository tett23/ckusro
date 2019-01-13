import cli from '../../src/cli';
import * as commandHandlers from '../../src/cli/commandHandlers';

describe(cli, () => {
  let spy: any;
  afterEach(() => spy.mockRestore());

  it('calls build command', async () => {
    spy = jest.spyOn(commandHandlers, 'buildHandler');
    await cli('-o /out build'.split(' '));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
