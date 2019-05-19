import React from 'react';

class TinyDownIcon extends React.PureComponent
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        return (
            <svg id={this.props.id} className={this.props.className} style={this.props.style}
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
            </svg>
        );
    }
}
export default TinyDownIcon;
