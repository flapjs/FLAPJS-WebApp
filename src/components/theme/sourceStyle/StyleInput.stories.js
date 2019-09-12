import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import StyleInput from './StyleInput.jsx';

storiesOf('StyleInput', module)
    .addDecorator(withKnobs)
    .add('playground', () =>
    {
        const source = React.createRef();
        return (
            <div>
                <div id="#source" ref={source} style={{ color: 'var(--color)'}}>
                    Hiya.
                </div>
                <StyleInput
                    {...propKnobs(StyleInput, 'Props', 1)}
                    {...propKnobs(StyleInput, 'HTML Attributes', 0, 1)}
                    source={source}
                    name="--color"/>
            </div>
        );
    });
