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

  addMessage(message, tag=null, clearOnAdd=true)
  {
    if (tag && clearOnAdd)
    {
      this.clearMessage(tag);
    }

    this.state.messages.push([message, tag]);
  }

  addWarningMessage(message, tag=null, clearOnAdd=true)
  {
    if (tag && clearOnAdd)
    {
      this.clearWarningMessage(tag);
    }

    this.state.warningMessages.push([message, tag]);
  }

  addErrorMessage(message, tag=null, clearOnAdd=true) {
    if (tag && clearOnAdd)
    {
      this.clearWarningMessage(tag);
    }

    this.state.errorMessages.push([message, tag]);
  }

  clearErrorMessage(tag=null) {
    for(let i = this.state.errorMessages.length-1; i >= 0; i--) {
      if(this.state.errorMessages[i][1] == tag) {
        this.state.errorMessages.splice(i, 1);
      }
    }
  }

  clearWarningMessage(tag=null) {
    for(let i = this.state.warningMessages.length-1; i >= 0; i--) {
      if(this.state.warningMessages[i][1] == tag) {
        this.state.warningMessages.splice(i, 1);
      }
    }
  }

  clearMessage(tag=null) {
    for(let i = this.state.messages.length-1; i >= 0; i--) {
      if(this.state.messages[i][1] == tag) {
        this.state.messages.splice(i, 1);
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
              return <div key={i} className="notification-message notification-error">
                {e[0]}
                <div className="notification-response">
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
              return <div key={i} className="notification-message notification-warning">
                {e[0]}
                <div className="notification-response">
                  <button onClick={(e) => {
                    this.state.warningMessages.splice(i, 1);
                  }}>
                    I do not care
                  </button>
                </div>
              </div>;
            })
          }
          {
            this.state.messages.map((e, i) => {
              return <div key={i} className="notification-message">
                {e[0]}
                <div className="notification-response">
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
