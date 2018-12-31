import React from 'react';

import FullscreenWidget from './FullscreenWidget.js';
import ZoomWidget from './ZoomWidget.js';
import FocusCenterWidget from './FocusCenterWidget.js';

class NavbarWidget extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const app = this.props.app;
    const viewport = app.getInputAdapter().getViewport();

    return (
      <div id={this.props.id}
        className={this.props.className}
        style={this.props.style}>
        <FullscreenWidget app={app}/>
        <ZoomWidget viewport={viewport}/>
        <FocusCenterWidget viewport={viewport}/>
      </div>
    );
  }
}

export default NavbarWidget;
