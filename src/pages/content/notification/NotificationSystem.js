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
        "If you need still help, find a tutor. I can't help you :( . . . Good-bye."]
    };
  }

  //TODO: allow add and delete by tag for messages
  addMessage(message, tag=null)
  {
    this.state.messages.push(message);
  }

  hasMessages()
  {
    return this.state.messages.length > 0;
  }

  render()
  {
    return <div className="notification-container">
      <div className="notification-stack">
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
    </div>;
  }
}

export default NotificationSystem;
