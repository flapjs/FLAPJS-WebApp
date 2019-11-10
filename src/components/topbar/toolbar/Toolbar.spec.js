import React from 'react';
import { shallow } from 'enzyme';

import Toolbar from './Toolbar.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<Toolbar/>);
});

describe('<Toolbar/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<Toolbar/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<Toolbar/> lifecycle', () =>
{
    /** ...later. */
});
