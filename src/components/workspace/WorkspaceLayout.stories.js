import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import WorkspaceLayout from './WorkspaceLayout.jsx';

storiesOf('WorkspaceLayout', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <WorkspaceLayout
            {...propKnobs(WorkspaceLayout, 'Primary', 1)}
            {...propKnobs(WorkspaceLayout, 'HTML Attributes', 0, 1)}/>
    ));
