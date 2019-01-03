import { shallow } from 'enzyme';
import React from 'react';
import TreeViewItem from '../../../../../src/staticRenderer/assets/components/TreeView/TreeViewItem';
import { buildFile, buildLoaderContext } from '../../../../__fixtures__';

describe(TreeViewItem, () => {
  it('renders correctly', () => {
    const context = buildLoaderContext({ path: '/test' });
    const file = buildFile({ id: 'test_1' });
    const wrapper = shallow(<TreeViewItem context={context} file={file} />);

    expect(wrapper.find('Children').type === null);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when the component have children', () => {
    const context = buildLoaderContext({ path: '/test' });
    const file = buildFile({ id: 'test_1' });
    const child = buildFile({ id: 'test_2' });
    const wrapper = shallow(
      <TreeViewItem context={context} file={file}>
        <TreeViewItem context={context} file={child} />
      </TreeViewItem>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
