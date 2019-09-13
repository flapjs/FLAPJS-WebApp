import React from 'react';
import PropTypes from 'prop-types';
import Style from './DefaultNotificationLayout.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';

class SequenceNotificationLayout extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const { message, notification, onClick, ...props } = this.props;

        return (
            <div className={Style.notification_container}
                {...props}>

                {message &&
                    message.split('\n').map((e, i) => <p key={e + ':' + i}>{e}</p>)}

                {this.props.children}
                
                <button style={{marginBottom: '1em'}} onClick={onClick}>
                    <LocaleString entity="message.action.next"/>
                </button>

                {notification && (
                    <button onClick={e => notification.close()}>
                        <LocaleString entity="message.action.close"/>
                    </button>
                )}
            </div>
        );
    }
}
SequenceNotificationLayout.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    message: PropTypes.string,
    onClick: PropTypes.func,
    //TODO: give this a proper type.
    notification: PropTypes.any,
};


export default SequenceNotificationLayout;
