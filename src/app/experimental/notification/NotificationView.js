import React from 'react';
import Style from './NotificationView.css';

import NotificationMessage from 'system/notification/components/NotificationMessage.js';

class NotificationView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const notificationManager = this.props.notificationManager;
    return <div id={this.props.id}
      className={Style.notification_container +
        " " + this.props.className}
      style={this.props.style}>
    {
      notificationManager.getMessages().map(e => {
        const id = e.getID();
        const ComponentClass = e.getComponentClass();
        const componentProps = e.getComponentProps() || {};

        return <NotificationMessage key={id} value={e}>
        { ComponentClass && <ComponentClass message={e} {...componentProps}/> }
        </NotificationMessage>;
      })
    }
    </div>;
  }
}
export default NotificationView;
