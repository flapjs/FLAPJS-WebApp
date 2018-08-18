import React from 'react';
import ReactDOM from 'react-dom';

import LandingPage from './components/LandingPage.js';

//Setup viewport
window.addEventListener('load', (event) => {
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Setup application
const FRAMES_PER_SECOND = 60;
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
    ReactDOM.render(React.createElement(LandingPage), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
