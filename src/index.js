import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/App.js';

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
    ReactDOM.render(React.createElement(App, {/*arguments*/}, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
