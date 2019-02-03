import { shallow } from 'enzyme';
import React from 'react';
import {
  buildJSX,
  Markdown,
} from '../../../../../../../src/cli/renderers/staticRenderer/assets/components/Markdown';
import { defaultPluginsConfig } from '../../../../../../../src/models/DefaultPluginConfig';
import defaultPlugins from '../../../../../../../src/models/plugins/defaultPlugins';
import { buildFileBuffer } from '../../../../../../__fixtures__';

describe(Markdown, () => {
  const plugins = defaultPlugins(defaultPluginsConfig());

  it('renders correctly', () => {
    const files = [buildFileBuffer({ id: 'test1', content: '[[foo]]' })];
    const actual = shallow(
      <Markdown plugins={plugins} currentFileBufferId={files[0].id} fileBuffers={files} />,
    );

    expect(actual).toMatchSnapshot();
  });

  it('throw Error when file does not exist', () => {
    const actual = () =>
      shallow(
        <Markdown
          plugins={plugins}
          currentFileBufferId="does_not_exist"
          fileBuffers={[]}
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
