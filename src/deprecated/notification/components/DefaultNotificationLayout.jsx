import React from 'react';
import PropTypes from 'prop-types';
import Style from './DefaultNotificationLayout.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';

export const STYLE_TYPE_DEFAULT = 'default';
export const STYLE_TYPE_WARNING = 'warning';
export const STYLE_TYPE_ERROR = 'error';
export const STYLE_TYPE_SUCCESS = 'success';

class DefaultNotificationLayout extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const message = props.message;
        const notification = props.notification;

        return (
            <div id={props.id}
                className={Style.notification_container +
                    ' ' + props.styleType +
                    ' ' + props.className}
                style={props.style}>
                {message &&
                    message.split('\n').map((e, i) => <p key={e + ':' + i}>{e}</p>)}
                {props.children}
                {notification &&
                    <button onClick={e => notification.close()}>
                        <LocaleString entity="message.action.close" />
                    </button>}
            </div>
        );
    }
}
DefaultNotificationLayout.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    message: PropTypes.string,
    //TODO: give this a proper type.
    styleType: PropTypes.string,
    //TODO: give this a proper type.
    notification: PropTypes.any,
};

export default DefaultNotificationLayout;
