import { shallow } from 'enzyme';
import React from 'react';
import TreeViewItem from '../../../../../src/staticRenderer/assets/components/TreeView/TreeViewItem';
import { buildFile } from '../../../../__fixtures__';

describe(TreeViewItem, () => {
  it('renders correctly', () => {
    const file = buildFile({ id: 'test_1' });
    const wrapper = shallow(<TreeViewItem file={file} />);

    expect(wrapper.find('Children').type === null);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when the component have children', () => {
    const file = buildFile({ id: 'test_1' });
    const child = buildFile({ id: 'test_2' });
    const wrapper = shallow(
      <TreeViewItem file={file}>
        <TreeViewItem file={child} />
      </TreeViewItem>,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
