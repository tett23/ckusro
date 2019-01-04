import render from '../../src/staticRenderer/render';
import {
  buildFile,
  buildGlobalState,
  buildLoaderContext,
} from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
    const contexts = [buildLoaderContext({ name: file.namespace })];
    const globalState = buildGlobalState({ files: [file] });
    const actual = render({
      globalState,
      markdown: {
        currentFileId: file.id,
        files: [file],
      },
    });

    expect(actual).toMatchSnapshot();
  });
});
