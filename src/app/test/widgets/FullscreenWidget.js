import React from 'react';

import IconStateButton from 'test/components/IconStateButton.js';
import FullscreenIcon from 'test/iconset/FullscreenIcon.js';
import FullscreenExitIcon from 'test/iconset/FullscreenExitIcon.js';

class FullscreenWidget extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const app = this.props.app;
    
    return (
      <IconStateButton id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        onClick={(e, i) => app.setState({hide: (i === 0)})}>
        <FullscreenIcon/>
        <FullscreenExitIcon/>
      </IconStateButton>
    );
  }
}

export default FullscreenWidget;
