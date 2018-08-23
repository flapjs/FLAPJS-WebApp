import React from 'react';
import './MessageContainer.css';

import ExitMessageButton from './ExitMessageButton.js';

class MessageContainer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className={"notification-message " + this.props.className}>
      <div className="notification-message-content">
        {
          /* Let new lines create divs */
          this.props.value.split("\\n").map((e, i) => {
            if (e.length > 0)
            {
              return <div key={e + "." + i}>{e}</div>
            }
            else
            {
              return <br key={e + "." + i}/>;
            }
          })
        }
      </div>
      <div className="notification-message-response">
        {this.props.children}
        {!this.props.hideDefaultExit && <ExitMessageButton onClick={this.props.onExit}/>}
      </div>
    </div>;
  }
}

export default MessageContainer;
