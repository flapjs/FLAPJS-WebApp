import React from 'react';
import { hot } from 'react-hot-loader';

import HomePage from 'pages/intro/HomePage.js';
import WorkPage from 'pages/content/WorkPage.js';
import Page404 from 'pages/Page404.js';

const PAGES = {
  '/': HomePage,
  '/content': WorkPage
};

class App extends React.Component
{
  render()
  {
    const PageHandler = PAGES[this.props.pathname] || Page404;
    return <PageHandler><PageHandler/>;
  }
}

//For hotloading this class
export default hot(module)(App);
