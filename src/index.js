import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from 'App.js';

const fps = 60;

//Setup viewport
window.addEventListener('load', (event) => {
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Setup application
const root = document.getElementById("root");

//Load application
function loadApplication()
{

}

let prevtime = 0;
function updateApplication(time)
{
  const dt = (time - prevtime) / fps;
  {
    ReactDOM.render(React.createElement(App, {/*arguments*/}, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
