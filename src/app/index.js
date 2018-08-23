import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'router.js';
import Config from 'config.js';
import { loadConfig, saveConfig } from 'config.js';

import App from 'content/App.js';

const AUTOSAVE_CONFIG = true;

Router.registerPage('/', App);

//Setup viewport
window.addEventListener('load', (event) => {
  loadConfig();
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});
//Warn user before exit
window.addEventListener('beforeunload', (event) => {
  if (AUTOSAVE_CONFIG)
  {
    //Only save if changes were made
    saveConfig();
  }

  const message = I18N.toString("alert.window.exit");
  event = event || window.event;
  // For IE and Firefox
  if (event) event.returnValue = message;

  //For Safari
  return message;
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
    const page = Router.getPage();
    ReactDOM.render(React.createElement(page), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
