import React from 'react';

class TriangleIcon extends React.PureComponent
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        return (
            <svg id={this.props.id} className={this.props.className} style={this.props.style}
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>
            </svg>
        );
    }
}
export default TriangleIcon;
