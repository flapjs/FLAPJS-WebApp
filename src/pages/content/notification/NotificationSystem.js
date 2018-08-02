import React from 'react';
import './NotificationSystem.css';

class NotificationSystem extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      messages: ["Good Morning! Welcome to the Flap.js Workspace!",
        "If you need help, the '?' button is at the top-right of the screen.",
        "If you need still help, find a tutor. I can't help you :( . . . Good-bye."],
      errorMessages: [],
      warningMessages: []
    };
  }

  //TODO: allow add and delete by tag for messages
  addMessage(message, tag=null)
  {
    if(tag="error") {
      this.state.errorMessages.push(message);
    } else if(tag="warning") {
      this.state.warningMessages.push(message);
    } else {
      this.state.messages.push(message);
    }
  }

  clearMessage(tag=null) {
    if(tag="error") {
      this.state.errorMessages.splice(0, this.state.errorMessages.length);
    } else if(tag="warning") {
      this.state.warningMessages.splice(0, this.state.warningMessages.length);
    } else {
      this.state.messages.splice(0, this.state.messages.length);
    }
  }

  hasMessages()
  {
    return this.state.messages.length > 0;
  }

  render()
  {
    return(
      <div className="notification-container">
        <div className="notification-stack">
          {
            this.state.errorMessages.map((e, i) => {
              return <div key={i} className="notification-message">
                {e}
                <div className="notification-message-response">
                  <button onClick={(e) => {
                    this.state.errorMessages.splice(i, 1);
                  }}>
                    Get out of my way
                  </button>
                </div>
              </div>;
            })
          }
          {
            this.state.messages.map((e, i) => {
              return <div key={i} className="notification-message">
                {e}
                <div className="notification-message-response">
                  <button onClick={(e) => {
                    this.state.messages.splice(i, 1);
                  }}>
                    Get out of my way
                  </button>
                </div>
              </div>;
            })
          }
        </div>
      </div>
    );
  }
}

export default NotificationSystem;
