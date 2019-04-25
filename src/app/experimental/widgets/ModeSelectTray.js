import React from 'react';
import Style from './ModeSelectTray.css';

import IconButton from 'experimental/components/IconButton.js';
import EditPencilIcon from 'components/iconset/EditPencilIcon.js';
import MoveIcon from 'components/iconset/MoveIcon.js';

class ModeSelectTray extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue)
  {
    if (this.props.onChange)
    {
      this.props.onChange(newValue);
    }
  }

  //Override
  render()
  {
    const mode = this.props.mode || 0;
    const onChange = this.props.onChange;

    return (
      <div id={this.props.id}
        className={Style.tray_container +
          " " + this.props.className}
        style={this.props.style}>
        <IconButton className={Style.tray_button +
          (mode === 0 ? " active " : "")}
          onClick={() => this.onChange(0)}
          title={I18N.toString("cursor.actionmode")}>
          <EditPencilIcon/>
        </IconButton>
        <IconButton className={Style.tray_button +
          (mode === 1 ? " active " : "")}
          onClick={() => this.onChange(1)}
          title={I18N.toString("cursor.movemode")}>
          <MoveIcon/>
        </IconButton>
      </div>
    );
  }
}
export default ModeSelectTray;
