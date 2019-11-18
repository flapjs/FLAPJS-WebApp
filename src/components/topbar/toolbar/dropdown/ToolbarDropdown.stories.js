import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import ToolbarDropdown from './ToolbarDropdown.jsx';

storiesOf('ToolbarDropdown', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <ToolbarDropdown
            {...propKnobs(ToolbarDropdown, 'Props', 3)}
            {...propKnobs(ToolbarDropdown, 'HTML Attributes', 0, 3)}/>
    ));
