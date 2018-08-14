import React from 'react';
import './NotificationSystem.css';

class ErrorEmptyTrans extends React.Component {
  constructor(props) {
    super(props);
  }

  toNFA() {

  }


  deleteTrans() {

  }

  render() {
    return(
        <div className="notification-message notification-error">
          <div className="notification-response">
            <button onClick={this.toNFA}>Change to NFA</button>
            <button onClick={this.deleteTrans}>Delete It</button>
          </div>
        </div>
    );
  }
}

export default ErrorEmptyTrans;