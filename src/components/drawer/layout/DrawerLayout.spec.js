import React from 'react';
import { shallow } from 'enzyme';

import DrawerLayout from './DrawerLayout.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<DrawerLayout/>);
});

describe('<DrawerLayout/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<DrawerLayout/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<DrawerLayout/> lifecycle', () =>
{
    /** ...later. */
});
