import cli from '../../src/cli';
import * as commandHandlers from '../../src/cli/commandHandlers';

describe(cli, () => {
  let spy: any;
  afterEach(() => spy.mockRestore());

  it('calls build command', async () => {
    spy = jest
      .spyOn(commandHandlers, 'buildHandler')
      .mockReturnValue(Promise.resolve(true));
    await cli('ckusro -o /out build'.split(' '));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls watch command', async () => {
    spy = jest
      .spyOn(commandHandlers, 'watchHandler')
      .mockReturnValue(Promise.resolve(true));
    await cli('ckusro -o /out watch'.split(' '));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
