import { shallow } from 'enzyme';
import React from 'react';
import Breadcrumbs from '../../../../../../src/cli/renderers/staticRenderer/assets/components/BreadcrumbsContainer/Breadcrumbs';
import { buildFileBuffer } from '../../../../../__fixtures__';

describe(Breadcrumbs, () => {
  it('renders correctly', () => {
    const fileBuffers = [buildFileBuffer()];
    const wrapper = shallow(
      <Breadcrumbs fileBuffers={fileBuffers} fileBuffer={fileBuffers[0]} />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
