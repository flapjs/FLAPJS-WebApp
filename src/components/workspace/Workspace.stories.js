import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import Workspace from './Workspace.jsx';

storiesOf('Workspace', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <Workspace
            {...propKnobs(Workspace, 'Primary', 3)}
            {...propKnobs(Workspace, 'HTML Attributes', 0, 3)}/>
    ));
