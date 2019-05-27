import React from 'react';

import Style from './DefaultNotificationLayout.css';

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
                    {I18N.toString('message.action.next')}
                </button>
                {notification && <button onClick={e => notification.close()}>
                    {I18N.toString('message.action.close')}
                </button>}
            </div>
        );
    }
}

export default SequenceNotificationLayout;
