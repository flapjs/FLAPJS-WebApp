import React from 'react';
import './NotificationSystem.css';

import { guid } from 'util/MathHelper.js';
import DefaultMessage from "./DefaultMessage";
import DefaultWarningMessage from "./DefaultWarningMessage";
import DefaultErrorMessage from "./DefaultErrorMessage";

class NotificationSystem extends React.Component
{
  constructor(props)
  {
    super(props);

    const graph = this.props.graph;
    const machineBuilder = this.props.machineBuilder;
    const controller = this.props.controller;

    this.state = {
      messages: []
    };
  }

  addMessage(message, tag=null, component=null, clearOnAdd=true) {
    if(tag && clearOnAdd) {
      this.clearMessage(tag);
    }

    if(component === null) {
      component = DefaultMessage;
    }

    const id = guid();
    this.state.messages.unshift([message, tag, component, id]);
  }

  clearMessage(tag=null) {
    if(!tag) {
      this.state.messages.splice(0, this.state.messages.length);
    } else {
      for(let i = this.state.messages.length-1; i >= 0; i--) {
        if(this.state.messages[i][1] == tag) {
          this.state.messages.splice(i, 1);
        }
      }
    }
  }

  addWarningMessage(message, tag=null, clearOnAdd=true)
  {
    console.error("The function addWarningMessage is deprecated. Please use addMessage.");
    this.addMessage(message, tag, DefaultWarningMessage, clearOnAdd);
  }

  addErrorMessage(message, tag=null, clearOnAdd=true) {
    console.error("The function addErrorMessage is deprecated. Please use addMessage.");
    this.addMessage(message, tag, DefaultErrorMessage, clearOnAdd);
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
              const message = I18N.toString(e[0]);
              const tag = e[1];
              const ComponentClass = e[2];
              const guid = e[3];
              return <ComponentClass key={guid}
                onExit={() => this.state.messages.splice(i, 1)}
                message={message}
                tag={tag}
                notification={this}/>;
            })
          }
        </div>
      </div>
    );
  }
}

export default NotificationSystem;
