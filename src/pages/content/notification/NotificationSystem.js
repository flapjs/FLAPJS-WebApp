import React from 'react';
import './NotificationSystem.css';
import DefaultMessage from "./DefaultMessage";

class NotificationSystem extends React.Component
{
  constructor(props)
  {
    super(props);

    const graph = this.props.graph;
    const machineBuilder = this.props.machineBuilder;

    this.state = {
      messages: [["Good Morning! Welcome to the Flap.js Workspace!", null, DefaultMessage],
        ["If you need help, the '?' button is at the top-right of the screen.", null, DefaultMessage],
        ["If you need still help, find a tutor. I can't help you :( . . . Good-bye.", null, DefaultMessage]],
    };
  }

  addMessage(message, tag=null, component=null, clearOnAdd=true) {
    if(tag && clearOnAdd) {
      this.clearMessage(tag);
    }

    if(component === null) {
      component = DefaultMessage;
    }
    this.state.messages.unshift([message, tag, component]);
  }

  clearMessage(tag=null) {
    for(let i = this.state.messages.length-1; i >= 0; i--) {
      if(this.state.messages[i][1] == tag) {
        this.state.messages.splice(i, 1);
      }
    }
  }

  addWarningMessage(message, tag=null, clearOnAdd=true)
  {
    console.error("The function addWarningMessage is deprecated. Please use addMessage.");
    this.addMessage(message, tag, null, clearOnAdd);
  }

  addErrorMessage(message, tag=null, clearOnAdd=true) {
    console.error("The function addErrorMessage is deprecated. Please use addMessage.");
    this.addMessage(message, tag, null, clearOnAdd);
  }

  clearErrorMessage(tag=null) {
    console.error("The function clearErrorMessage is deprecated. Please use clearMessage.");
    this.clearMessage(tag);
  }

  clearWarningMessage(tag=null) {
    console.error("The function clearWarningMessage is deprecated. Please use clearMessage.");
    this.clearMessage(tag);
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
            this.state.messages.map((e, i) => {
              return React.createElement(e[2], {key: i, onDelete: () => this.state.messages.splice(i, 1),
                message: e[0], tag: e[1], notification: this}, null);
            })
          }
        </div>
      </div>
    );
  }
}

export default NotificationSystem;
