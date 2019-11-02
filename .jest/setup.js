/* eslint-env node */

// Prepare async/await transformers
import 'regenerator-runtime';

// Setup React 16 with Enzyme
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Setup require.context for Storybook
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();

// Setup jest-fetch-mock
global.fetch = require('jest-fetch-mock');
fetch.mockResponse('');

// Mock window.getComputedStyle()
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue(prop) { return ''; }
    })
});
