/* eslint-disable import/first */
import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@flapjs/util/MathHelper.js', () => ({
    __esModule: true,
    uuid: jest.fn(),
}));

import { uuid } from '@flapjs/util/MathHelper.js';
import App from './App.jsx';

let wrapper;
let nextUUID = 0;

beforeEach(() =>
{
    uuid.mockImplementation(() => nextUUID++);
    wrapper = shallow(<App/>);
});

describe('<App/> rendering', () =>
{
    test('renders correctly', () =>
    {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<App/> interaction', () =>
{
    /** I promise I will test you soon... */
});

describe('<App/> lifecycle', () =>
{
    /** ...later. */
});
