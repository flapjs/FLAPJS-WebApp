import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'router.js';
import Config from 'config.js';
import { loadConfig, saveConfig } from 'config.js';
import { EXIT_WINDOW_ALERT } from 'lang.js';

import App from 'content/App.js';
import NotFoundPage from '404/NotFoundPage.js';

//HACK: to determine if this is first time use
import AutoSaver from 'util/AutoSaver.js';

const USE_SERVICE_WORKER = false;
const AUTOSAVE_CONFIG = false;

Router.registerPage('/', App);
Router.registerPage(null, NotFoundPage);

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
    saveConfig();
  }

  event = event || window.event;
  // For IE and Firefox
  if (event) event.returnValue = EXIT_WINDOW_ALERT;

  //For Safari
  return message;
});

//Service Worker
if (USE_SERVICE_WORKER && 'serviceWorker' in navigator)
{
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/src/sw/service-worker.js').then(function(registration) {
      console.log("ServiceWorker registration successful: ", registration.scope);
    }, function(err) {
      console.log("ServiceWorker registration failed: ", err);
    });
  });
}

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
