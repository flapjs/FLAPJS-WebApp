import React from 'react';
import './NotFoundPage.css';

import Router from 'router.js';
import logo404 from './Pictures/404logo.png';

class NotFoundPage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    Router.routeTo('/');
  }

  render()
  {
    return(
        <div className="four04-container">
          <h1 className="four04-heading">Page Not Found</h1>
          <div className="four04-logo" onClick={this.onClick}>
            <img src={logo404} alt="logo404" height="100px" />
          </div>
          <p className="four04-text">Sorry, the page you're looking for isn't available.</p>
        </div>
    );
  }
}

export default NotFoundPage;
