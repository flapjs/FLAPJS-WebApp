import React from 'react';
import PropTypes from 'prop-types';
// import Style from './__NAME__.module.css';

/**
 * A React component that can do anything you want. :D
 */
class __NAME__ extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;
        
        return (
            <div id={props.id}
                style={props.style}
                className={props.className}>
            </div>
        );
    }
}

__NAME__.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};
__NAME__.defaultProps = {
};

export default __NAME__;
