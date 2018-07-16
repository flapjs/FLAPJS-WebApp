import React from 'react';

import './ExpandButton.css';

class ExpandButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isOpen: false
    }
  }

  render()
  {
    return <div className={"drawer-expand" +
      (this.props.open ? " open" : "")}>
      <svg width="24" height="24"
        viewBox="0 0 18 24"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3.737l12.395 8.263-12.395 8.263v-16.526zm-2-3.737v24l18-12-18-12z"/>
      </svg>
    </div>;
  }
}

export default ExpandButton;
