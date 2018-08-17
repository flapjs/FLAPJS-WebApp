import React from 'react';
import './NotificationSystem.css';

class DefaultErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="notification-message notification-error">
          {this.props.message}
          <div className="notification-response">
            <button onClick={this.props.onDelete}>Get out of my way</button>
          </div>
        </div>
    );
  }
}

export default DefaultErrorMessage;