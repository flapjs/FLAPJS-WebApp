import React from 'react';
import Style from './NavbarWidget.css';

import ZoomWidget from 'experimental/widgets/ZoomWidget.js';
import FocusCenterWidget from 'experimental/widgets/FocusCenterWidget.js';

class NavbarWidget extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const viewportAdapter = this.props.viewportAdapter;

    return (
      <div id={this.props.id}
        className={Style.navbar_container +
          " " + this.props.className}
        style={this.props.style}>
        <ZoomWidget className={Style.navbar_widget_container} viewport={viewportAdapter}/>
        <FocusCenterWidget className={Style.navbar_widget} viewport={viewportAdapter}/>
      </div>
    );
  }
}

export default NavbarWidget;
