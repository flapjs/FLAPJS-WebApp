import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import DrawerLayout from './DrawerLayout.jsx';

storiesOf('DrawerLayout', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <DrawerLayout
            {...propKnobs(DrawerLayout, 'Primary', 1)}
            {...propKnobs(DrawerLayout, 'HTML Attributes', 0, 1)}/>
    ));
