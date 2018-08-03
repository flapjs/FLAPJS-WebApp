import React from 'react';

class CollapseIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button className="icon collapse-icon" onClick={this.props.onClick}>
    {
      this.props.more == true ?
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="6 12 12 1">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
        </svg>
      :
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="6 12 12 1">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>
    }
    </button>;
  }
}

export default CollapseIcon;
