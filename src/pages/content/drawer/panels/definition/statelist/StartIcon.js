import React from 'react';

class StartIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button className="icon start-icon">
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="5 0 18 24"
        width="1em"
        height="1em">
        <path d="M5 3.737l12.395 8.263-12.395 8.263v-16.526zm-2-3.737v24l18-12-18-12z"/>
      </svg>
    </button>;
  }
}

export default StartIcon;
