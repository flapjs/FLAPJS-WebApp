import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '@flapjs/services/notification/components/messages/ErrorMessage.jsx';

class NFAToDFAConversionMessage extends React.Component
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
            <ErrorMessage
                content={props.content}
                notification={props.notification}
                onClose={props.onClose}>
                {props.children}
            </ErrorMessage>
        );
    }
}
NFAToDFAConversionMessage.propTypes = {
    children: PropTypes.node,
    notification: PropTypes.object.isRequired,
    content: PropTypes.string,
    onClose: PropTypes.func,
};
NFAToDFAConversionMessage.defaultProps = {
    content: '',
};

export default NFAToDFAConversionMessage;
