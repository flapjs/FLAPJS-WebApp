import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';
import { withFullscreen } from '@flapjs/util/storybook/Fullscreen.js';

import DrawerLayout from './DrawerLayout.jsx';

storiesOf('DrawerLayout', module)
    .addDecorator(withKnobs)
    .addDecorator(withFullscreen)
    .add('playground', () => (
        <DrawerLayout
            {...propKnobs(DrawerLayout, 'Props', 1)}
            {...propKnobs(DrawerLayout, 'HTML Attributes', 0, 1)}
            renderDrawer={() =>
                <div style={{color: 'white', width: '100%', height: '100%'}}>
                    I am drawer content. Yippee!!!
                </div>
            }>
            <div style={{color: 'black', width: '100%', height: '100%'}}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas in sem magna. Aliquam ultrices convallis cursus.
                    In hac habitasse platea dictumst. Quisque eu tellus magna.
                    Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt
                    non sapien quis, finibus vestibulum ante.
                </p>
                <p>
                    Curabitur vulputate et ligula in congue. Phasellus ac imperdiet
                    libero, sagittis interdum elit. Suspendisse potenti.
                </p>
            </div>
        </DrawerLayout>
    ));
