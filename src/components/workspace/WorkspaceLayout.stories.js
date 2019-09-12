import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { propKnobs } from '@flapjs/util/storybook/PropKnobs.js';
import { withFullscreen } from '@flapjs/util/storybook/Fullscreen.js';

import WorkspaceLayout from './WorkspaceLayout.jsx';

storiesOf('WorkspaceLayout', module)
    .addDecorator(withKnobs)
    .addDecorator(withFullscreen)
    .add('playground', () => (
        <WorkspaceLayout
            {...propKnobs(WorkspaceLayout, 'Props', 1)}
            {...propKnobs(WorkspaceLayout, 'HTML Attributes', 0, 1)}
            renderForeground={() =>
                <div style={{ background: 'dodgerblue' }}>
                    {text('foreground text', 'Sed diam est, fermentum et blandit id, blandit ut est. Morbi venenatis interdum magna id feugiat. Nunc vestibulum sit amet massa ut malesuada. Donec non tortor eu ex feugiat finibus et non dolor. Integer in leo lorem. Nam accumsan finibus libero vehicula viverra. Fusce pulvinar sapien in tincidunt fermentum. Quisque vehicula convallis ullamcorper. Etiam luctus volutpat nisi, ut feugiat risus maximus tempus. Donec tincidunt accumsan sem. Donec vitae orci nec nisi scelerisque mollis. Ut fermentum sem eu magna volutpat semper. Suspendisse porta dui sit amet nulla hendrerit tincidunt. Nam eget diam sed libero tincidunt volutpat in non nisl. Cras id venenatis magna, sed facilisis tellus. Morbi lacinia at ante at congue.')}
                </div>}
            renderBackground={() =>
                <div>
                    {text('background text', 'Duis imperdiet enim ut augue molestie elementum. In sagittis volutpat rutrum. Cras facilisis libero libero, in tempor ipsum rutrum vitae. Proin congue, odio eu consequat ultricies, lorem tellus blandit ex, a pulvinar ligula felis a nisi. Pellentesque fermentum a metus ac consectetur. In eros dolor, auctor nec elementum vel, iaculis vitae felis. In consectetur aliquam lorem, quis porta turpis molestie a. Quisque consectetur vulputate sem, nec cursus sem aliquet non. Pellentesque diam velit, ornare venenatis elit nec, pretium interdum libero. In vestibulum purus lectus, sit amet condimentum ante pellentesque vitae. Praesent ut tincidunt sapien, eu sollicitudin leo.')}
                </div>}/>
    ));
