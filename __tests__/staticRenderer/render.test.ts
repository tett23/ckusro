import render from '../../src/staticRenderer/render';
import { buildFile, buildGlobalState } from '../__fixtures__';

describe(render, () => {
  it('renders correctly', () => {
    const file = buildFile();
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
