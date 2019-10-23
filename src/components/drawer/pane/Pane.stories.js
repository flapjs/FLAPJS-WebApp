import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import Pane from './Pane.jsx';

storiesOf('Pane', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <Pane
            {...propKnobs(Pane, 'Props', 3)}
            {...propKnobs(Pane, 'HTML Attributes', 0, 3)}/>
    ));
