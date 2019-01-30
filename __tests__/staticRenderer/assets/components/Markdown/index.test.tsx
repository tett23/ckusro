import { shallow } from 'enzyme';
import React from 'react';
import { defaultPluginsConfig } from '../../../../../src/models/DefaultPluginConfig';
import defaultPlugins from '../../../../../src/models/plugins/defaultPlugins';
import {
  buildJSX,
  Markdown,
} from '../../../../../src/staticRenderer/assets/components/Markdown';
import { buildFile } from '../../../../__fixtures__';

describe(Markdown, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('renders correctly', () => {
    const files = [buildFile({ id: 'test1', content: '[[foo]]' })];
    const actual = shallow(
      <Markdown plugins={plugins} currentFileId={files[0].id} files={files} />,
    );

    expect(actual).toMatchSnapshot();
  });

  it('throw Error when file does not exist', () => {
    const actual = () =>
      shallow(
        <Markdown
          plugins={plugins}
          currentFileId="does_not_exist"
          files={[]}
        />,
      );

    expect(actual).toThrowError();
  });
});

describe(buildJSX, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('renders correctly', () => {
    const actual = buildJSX(plugins, '[[foo]]');

    expect(actual).toMatchSnapshot();
  });
});
