import React from 'react';
import { shallow } from 'enzyme';

import ToolbarDropdownOptions from './ToolbarDropdownOptions.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<ToolbarDropdownOptions/>);
});

describe('<ToolbarDropdownOptions/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<ToolbarDropdownOptions/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<ToolbarDropdownOptions/> lifecycle', () =>
{
    /** ...later. */
});
