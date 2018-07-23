import React from 'react';
import './Page404.css';
import logo404 from './Pictures/404logo.png';

class Page404 extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return(
        <div className="four04-container">
          <h1 className="four04-heading">Page Not Found</h1>
          <a href="https://www.google.com">
            <img src={logo404} alt="logo404" height="100px" />
          </a>
          <p className="four04-text">Sorry, the page you're looking for isn't available.</p>
        </div>
    );
  }
}

export default Page404;
