import React from 'react';

class AboutPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.container = null;
    }

    /** @override */
    render()
    {
        return <div className={'panel-container ' + this.props.className} id="about" ref={ref=>this.container=ref} style={this.props.style}>
            <div className="panel-title">
                <h1>Finite State Automata</h1>
            </div>
            <div className="panel-content">
                <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                <p>{'<- Tap on a tab to begin!'}</p>
            </div>
            <div className="panel-bottom"></div>
        </div>;
    }
}

export default AboutPanel;
