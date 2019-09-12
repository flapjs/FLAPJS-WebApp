import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import SideBarLayout from './SideBarLayout.jsx';

storiesOf('SideBarLayout', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <SideBarLayout
            {...propKnobs(SideBarLayout, 'Primary', 3)}
            {...propKnobs(SideBarLayout, 'HTML Attributes', 0, 3)}/>
    ));
