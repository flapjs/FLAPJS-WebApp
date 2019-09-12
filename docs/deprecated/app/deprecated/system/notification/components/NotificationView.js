import React from 'react';
import './NotificationView.css';

import NotificationMessage from './NotificationMessage.js';

class NotificationView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    const notificationManager = this.props.notificationManager;
    return <div className={"notification-container " + this.props.className} id={this.props.id} style={this.props.style}>
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
