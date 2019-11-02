import React from 'react';
import Pane from '@flapjs/components/drawer/pane/Pane.jsx';

class TestingPanel extends React.Component
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

export default TestingPanel;
