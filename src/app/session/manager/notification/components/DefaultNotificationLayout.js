import React from 'react';
import Style from './DefaultNotificationLayout.css';

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
        const message = this.props.message;
        const notification = this.props.notification;

        return (
            <div id={this.props.id}
                className={Style.notification_container +
                    ' ' + this.props.styleType +
                    ' ' + this.props.className}
                style={this.props.style}>
                {message &&
                    message.split('\n').map((e, i) => <p key={e + ':' + i}>{e}</p>)}
                {this.props.children}
                {notification &&
                    <button onClick={e => notification.close()}>
                        {I18N.toString('message.action.close')}
                    </button>}
            </div>
        );
    }
}

export default DefaultNotificationLayout;
