import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import ToolbarDropdownOptions from './ToolbarDropdownOptions.jsx';

storiesOf('ToolbarDropdownOptions', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <ToolbarDropdownOptions
            {...propKnobs(ToolbarDropdownOptions, 'Props', 3)}
            {...propKnobs(ToolbarDropdownOptions, 'HTML Attributes', 0, 3)}/>
    ));
