import React from 'react';
import Style from './NotificationList.module.css';

import NotificationService from '../NotificationService.js';
import InfoMessage from './messages/InfoMessage.jsx';

class NotificationList extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <div className={Style.container}>
                <NotificationService.CONTEXT.Consumer>
                    {
                        (notificationService, dispatch) =>
                        {
                            return notificationService.notifications.map(notification =>
                            {
                                let MessageComponent = notification.message || InfoMessage;
                                return (
                                    <MessageComponent
                                        key={notification.id}
                                        notification={notification}
                                        textContent={notification.content}
                                        onClose={notification => dispatch({ type: 'close', notification })}
                                        { ...notification.props } />
                                );
                            });
                        }
                    }
                </NotificationService.CONTEXT.Consumer>
            </div>
        );
    }
}

export default NotificationList;
