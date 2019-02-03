import cli from '../../src/cli/renderers';
import * as commandHandlers from '../../src/cli/commandHandlers';
import * as watchHandler from '../../src/cli/commandHandlers/watchHandler';

describe(cli, () => {
  let spy: any;
  afterEach(() => spy.mockRestore());

  it('calls build command', async () => {
    spy = jest.spyOn(commandHandlers, 'buildHandler').mockResolvedValue(true);
    await cli('ckusro -o /out build'.split(' '));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls watch command', async () => {
    spy = jest.spyOn(watchHandler, 'default').mockResolvedValue(true);
    await cli('ckusro -o /out watch'.split(' '));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
