import React from 'react';
import Style from './TrashCanWidget.css';

import TrashCanDetailedIcon from 'test/iconset/TrashCanDetailedIcon.js';

class TrashCanWidget extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={Style.trash_container +
          " " + this.props.className}
        style={this.props.style}>
        <TrashCanDetailedIcon/>
      </div>
    );
  }
}

export default TrashCanWidget;
