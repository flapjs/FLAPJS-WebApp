import React from 'react';
import ReactDOM from 'react-dom';

import HomePage from 'pages/home/HomePage.js';
import App from 'pages/content/App.js';
import Page404 from 'pages/404/Page404.js';

const PAGES = {
  '/': HomePage,
  '/app': App
};

//TODO: this should be set by the server! initially it should be '/'.
const ROUTER = {
  pathname: "/"
};

const FRAMES_PER_SECOND = 60;

//Setup viewport
window.addEventListener('load', (event) => {
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Setup application
let prevtime = 0;
let root = null;

//Load application
function loadApplication()
{
  root = document.getElementById("root");
}

//Update application
function updateApplication(time)
{
  const dt = (time - prevtime) / FRAMES_PER_SECOND;
  {
    const PageHandler = PAGES[ROUTER.pathname] || Page404;
    ReactDOM.render(React.createElement(PageHandler, { router: ROUTER }, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
