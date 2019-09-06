/* eslint-env node */

// Setup React 16 with Enzyme
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Setup require.context for Storybook
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();