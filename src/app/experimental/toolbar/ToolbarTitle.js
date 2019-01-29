import React from 'react';
import Style from './ToolbarTitle.css';

import FormattedInput from 'system/formattedinput/FormattedInput.js';
import OfflineIcon from 'experimental/iconset/OfflineIcon.js';

const DEFAULT_TITLE = "Untitled";

class ToolbarTitle extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
  }

  setTitle(title)
  {
    this.ref.resetValue(title);
  }

  getTitle()
  {
    return this.ref.value;
  }

  //Override
  render()
  {
    const title = this.props.title;
    const offline = !(navigator && navigator.onLine);
    const onClick = this.props.onClick;

    return (
      <div id={this.props.id}
        className={Style.title_container +
          " " + this.props.className}
        style={this.props.style}>
        <span className={Style.title_input_container}>
          <FormattedInput ref={ref=>this.ref=ref}
            defaultValue={DEFAULT_TITLE}/>
          {offline && <OfflineIcon className={Style.offline_status}/>}
        </span>
        <div className={Style.title_subtitle} onClick={onClick}>
          {title}
        </div>
      </div>
    );
  }
}

export default ToolbarTitle;
