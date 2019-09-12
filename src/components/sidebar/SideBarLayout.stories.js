import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';
import { withFullscreen } from '@flapjs/util/storybook/Fullscreen.js';

import SideBarLayout from './SideBarLayout.jsx';

storiesOf('SideBarLayout', module)
    .addDecorator(withKnobs)
    .addDecorator(withFullscreen)
    .add('playground', () => (
        <SideBarLayout
            {...propKnobs(SideBarLayout, 'Props', 1)}
            {...propKnobs(SideBarLayout, 'HTML Attributes', 0, 1)}
            renderSideBar={() =>
                <div>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                </div>}>
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
        </SideBarLayout>
    ));
