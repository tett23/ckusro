import { shallow } from 'enzyme';
import React from 'react';
import treeBuilder from '../../../../../../../../src/cli/renderers/staticRenderer/assets/components/TreeViewContainer/treeBuilder';
import TreeView from '../../../../../../../../src/cli/renderers/staticRenderer/assets/components/TreeViewContainer/TreeView';
import { buildFileBuffer } from '../../../../../../../__fixtures__';

describe(TreeView, () => {
  it('renders correctly', () => {
    const fileBuffers = [
      buildFileBuffer({ id: 'test1', namespace: 'test1', path: '/' }),
      buildFileBuffer({ id: 'test1', namespace: 'test1', path: '/foo.md' }),
      buildFileBuffer({ id: 'test2', namespace: 'test2', path: '/' }),
    ];
    const nodes = treeBuilder(fileBuffers);

    const wrapper = shallow(
      <TreeView nodes={nodes} fileBuffers={fileBuffers} />,
    );

    expect(wrapper.find('ul > TreeViewItem').length === 2);
    expect(wrapper).toMatchSnapshot();
  });
});
