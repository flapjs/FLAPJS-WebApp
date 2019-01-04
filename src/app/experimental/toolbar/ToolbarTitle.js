import React from 'react';
import Style from './ToolbarTitle.css';

import FormattedInput from 'system/formattedinput/FormattedInput.js';

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
    return (
      <div id={this.props.id}
        className={Style.title_container +
          " " + this.props.className}
        style={this.props.style}>
        <span className={Style.title_input_container}>
          <FormattedInput ref={ref=>this.ref=ref}
            defaultValue={DEFAULT_TITLE}/>
        </span>
        <div className={Style.title_subtitle}>
          ModuleName
        </div>
      </div>
    );
  }
}

export default ToolbarTitle;
