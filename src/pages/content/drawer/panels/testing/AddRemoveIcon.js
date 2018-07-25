import React from 'react';

class AddRemoveIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    if (this.props.onAdd)
    {
      //Add icon
      return <button className="addremove-icon" onClick={this.props.onAdd}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </button>;
    }
    else if (this.props.onRemove)
    {
      //Remove icon
      return <button className="addremove-icon" onClick={this.props.onRemove}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
        </svg>
      </button>;
    }
    else
    {
      //Empty icon
      return <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5"/>
        </svg>
      </button>;
    }
  }
}

export default AddRemoveIcon;
