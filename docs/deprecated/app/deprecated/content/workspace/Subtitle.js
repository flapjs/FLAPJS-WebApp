import React from 'react';
import './Subtitle.css';

import Config from 'deprecated/config.js';

class Subtitle extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = { active: false };

    this.messageTimer = null;
  }

  componentDidMount()
  {
    this.messageTimer = setTimeout(() => {
      this.setState({ active: true });
    }, Config.INIT_WAITTIME);
  }

  render()
  {
    const visible = this.state.active ? this.props.visible : false;
    return <text y="-1em" className={"graph-ui subtitle" + (visible ? " visible" : "")}
      textAnchor="middle">{I18N.toString("message.workspace.empty")}</text>;
  }
}

export default Subtitle;
