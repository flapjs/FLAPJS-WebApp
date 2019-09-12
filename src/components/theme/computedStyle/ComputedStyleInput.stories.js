import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import ComputedStyleInput from './ComputedStyleInput.jsx';
import StyleInput from '../sourceStyle/StyleInput.jsx';

storiesOf('ComputedStyleInput', module)
    .addDecorator(withKnobs)
    .add('playground', () =>
    {
        const source = React.createRef();
        const sourceStyleInput = React.createRef();

        return (
            <div>
                <div id="#source" ref={source} style={{ color: 'var(--some-color)', background: 'var(--some-background)'}}>
                    Hello.
                </div>
                <StyleInput
                    ref={sourceStyleInput}
                    source={source}
                    name="--some-color"/>
                <ComputedStyleInput
                    {...propKnobs(ComputedStyleInput, 'Props', 1)}
                    {...propKnobs(ComputedStyleInput, 'HTML Attributes', 0, 1)}
                    source={source}
                    name="--some-background"
                    compute={sourceStyleInput}/>
            </div>
        );
    });
