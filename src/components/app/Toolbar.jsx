import React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <div className="toolbar">
                <input type="text" value="what"/>
                <button>What?</button>
            </div>
        );
    }
}

export default Toolbar;
