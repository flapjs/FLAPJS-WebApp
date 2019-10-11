import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import App from './App.jsx';

function changeModuleMock(nextModuleID)
{
    // Do nothing...
}

function renderModuleMock(layerID, layerProps)
{
    // Do nothing...
    return null;
}

storiesOf('App', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <App
            {...propKnobs(App, 'Props', 1)}
            {...propKnobs(App, 'HTML Attributes', 0, 1)}
            changeModule={changeModuleMock}
            renderModule={renderModuleMock} />
    ));
