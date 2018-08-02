import React from 'react';
import './NotificationSystem.css';

class NotificationSystem extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      messages: [["Good Morning! Welcome to the Flap.js Workspace!", null],
        ["If you need help, the '?' button is at the top-right of the screen.", null],
        ["If you need still help, find a tutor. I can't help you :( . . . Good-bye.", null]],
      errorMessages: [],
      warningMessages: []
    };
  }

  //TODO: allow add and delete by tag for messages
  addMessage(message, tag=null)
  {
    this.state.messages.push([message, tag]);
  }

  addErrorMessage(message, tag=null) {
    this.state.errorMessages.push([message, tag]);
  }


  clearErrorMessage(tag=null) {
    for(let i = this.state.errorMessages.length-1; i >= 0; i--) {
      if(this.state.errorMessages[i][1] == tag) {
        this.state.errorMessages.splice(i, 1);
      }
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
              return <div key={i} className="notification-message" id="notification-message-error">
                {e[0]}
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
            this.state.warningMessages.map((e, i) => {
              return <div key={i} className="notification-message" id="notification-message-warning">
                {e[0]}
                <div className="notification-message-response">
                  <button onClick={(e) => {
                    this.state.warningMessages.splice(i, 1);
                  }}>
                    I don't care
                  </button>
                </div>
              </div>;
            })
          }
          {
            this.state.messages.map((e, i) => {
              return <div key={i} className="notification-message">
                {e[0]}
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
