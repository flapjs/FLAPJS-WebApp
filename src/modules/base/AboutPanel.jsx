import React from 'react';
import Pane from '@flapjs/components/panel/pane/Pane.jsx';

import AboutTab from './AboutTab.jsx';

class AboutPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <Pane>
                Hello!
            </Pane>
        );
    }
}
AboutPanel.Tab = AboutTab;

export default AboutPanel;
