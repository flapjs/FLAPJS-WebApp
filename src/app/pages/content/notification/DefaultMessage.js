import React from 'react';
import './NotificationSystem.css';

class DefaultMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="notification-message">
          {this.props.message}
          <div className="notification-response">
            <button onClick={this.props.onDelete}>Get out of my way</button>
          </div>
        </div>
    );
  }
}

export default DefaultMessage;