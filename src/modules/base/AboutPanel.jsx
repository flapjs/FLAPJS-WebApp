import React from 'react';
import Pane from '@flapjs/components/panel/pane/Pane.jsx';

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

export default AboutPanel;
