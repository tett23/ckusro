import { shallow } from 'enzyme';
import React from 'react';
import TreeViewItem from '../../../../../../../../src/cli/renderers/staticRenderer/assets/components/TreeViewContainer/TreeView/TreeViewItem';
import { buildFileBuffer } from '../../../../../../../__fixtures__';

describe(TreeViewItem, () => {
  it('renders correctly', () => {
    const fileBuffer = buildFileBuffer({ id: 'test_1' });
    const wrapper = shallow(<TreeViewItem fileBuffer={fileBuffer} />);

    expect(wrapper.find('Children').type === null);
    expect(wrapper).toMatchSnapshot();
  });
});
