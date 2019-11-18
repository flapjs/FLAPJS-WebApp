import React from 'react';
import { shallow } from 'enzyme';

import ToolbarDropdown from './ToolbarDropdown.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<ToolbarDropdown/>);
});

describe('<ToolbarDropdown/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<ToolbarDropdown/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<ToolbarDropdown/> lifecycle', () =>
{
    /** ...later. */
});
