import React from 'react';
import { shallow } from 'enzyme';

import Pane from './Pane.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<Pane/>);
});

describe('<Pane/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<Pane/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<Pane/> lifecycle', () =>
{
    /** ...later. */
});
