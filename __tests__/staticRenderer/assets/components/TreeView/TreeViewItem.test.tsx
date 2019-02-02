import { shallow } from 'enzyme';
import React from 'react';
import TreeViewItem from '../../../../../src/staticRenderer/assets/components/TreeView/TreeViewItem';
import {
  buildFileBuffer,
  buildLocalLoaderContext,
} from '../../../../__fixtures__';

describe(TreeViewItem, () => {
  it('renders correctly', () => {
    const context = buildLocalLoaderContext({ path: '/test' });
    const file = buildFileBuffer({ id: 'test_1' });
    const wrapper = shallow(<TreeViewItem context={context} file={file} />);

    expect(wrapper.find('Children').type === null);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when the component have children', () => {
    const context = buildLocalLoaderContext({ path: '/test' });
    const file = buildFileBuffer({ id: 'test_1' });
    const child = buildFileBuffer({ id: 'test_2' });
    const wrapper = shallow(
      <TreeViewItem context={context} file={file}>
        <TreeViewItem context={context} file={child} />
      </TreeViewItem>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
