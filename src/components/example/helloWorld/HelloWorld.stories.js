import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';

import HelloWorld from './HelloWorld.jsx';

storiesOf('HelloWorld', module)
    .addDecorator(withKnobs)
    .add('playground', () => (
        <HelloWorld
            {...propKnobs(HelloWorld, 'Props', 3)}
            {...propKnobs(HelloWorld, 'HTML Attributes', 0, 3)}/>
    ))
    .add('with title', () => (
        <HelloWorld title={text('title', 'home')}/>
    ))
    .add('with rainbow', () => (
        <HelloWorld rainbow={boolean('rainbow', true)}/>
    ))
    .add('custom style', () => (
        <HelloWorld
            title='custom style'
            style={object('style', {
                backgroundColor: 'pink',
                border: '5px dotted limegreen',
            })}
        />
    ));
