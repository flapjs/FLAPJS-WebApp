import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import Toolbar from './Toolbar.jsx';

storiesOf('Toolbar', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <Toolbar
            {...propKnobs(Toolbar, 'Props', 3)}
            {...propKnobs(Toolbar, 'HTML Attributes', 0, 3)}/>
    ));
