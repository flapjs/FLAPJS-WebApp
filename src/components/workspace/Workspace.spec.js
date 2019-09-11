import React from 'react';
import { shallow } from 'enzyme';

import Workspace from './Workspace.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<Workspace/>);
});

describe('<Workspace/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<Workspace/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<Workspace/> lifecycle', () =>
{
    /** ...later. */
});
