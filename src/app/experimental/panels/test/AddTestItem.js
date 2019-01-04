import React from 'react';
import Style from './TestItem.css';

import IconButton from 'experimental/components/IconButton.js';
import AddIcon from 'experimental/iconset/AddIcon.js';

class AddTestItem extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {

  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={Style.test_item_container +
          " " + this.props.className}
        style={this.props.style}>
        <IconButton className={Style.create_button}
          title={"Add"} onClick={this.onClick}>
          <AddIcon/>
        </IconButton>
      </div>
    );
  }
}

export default AddTestItem;
