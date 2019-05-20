import React from 'react';

class SaveDiskIcon extends React.PureComponent
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        return (
            <svg id={this.props.id} className={this.props.className} style={this.props.style}
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24">
                <path d="M17,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V7L17,3z M19,19H5V5h11.17L19,7.83V19z"/>
                <path d="M12,12c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3C15,13.34,13.66,12,12,12z"/>
                <rect x="6" y="6" width="9" height="4"/>
            </svg>
        );
    }
}
export default SaveDiskIcon;
