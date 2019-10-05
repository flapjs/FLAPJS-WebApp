import React from 'react';
import { shallow } from 'enzyme';

import SideBarLayout from './SideBarLayout.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<SideBarLayout/>);
});

describe('<SideBarLayout/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<SideBarLayout/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<SideBarLayout/> lifecycle', () =>
{
    /** ...later. */
});
