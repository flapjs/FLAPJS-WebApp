import React from 'react';
import { shallow } from 'enzyme';

import WorkspaceLayout from './WorkspaceLayout.jsx';

let wrapper;

beforeEach(() =>
{
    wrapper = shallow(<WorkspaceLayout/>);
});

describe('<WorkspaceLayout/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<WorkspaceLayout/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<WorkspaceLayout/> lifecycle', () =>
{
    /** ...later. */
});
