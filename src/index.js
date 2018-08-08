import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'router.js';
import Config from 'config.js';
import { loadConfig, saveConfig } from 'config.js';

import HomePage from 'pages/home/HomePage.js';
import App from 'pages/content/App.js';
import NotFoundPage from 'pages/404/NotFoundPage.js';

//HACK: to determine if this is first time use
import AutoSaver from 'util/AutoSaver.js';

const ALWAYS_OPEN_WELCOME_PAGE = false;

Router.registerPage('/', HomePage);
Router.registerPage('/app', App);
Router.registerPage(null, NotFoundPage);

//Skip welcome page if already seen it
if (!ALWAYS_OPEN_WELCOME_PAGE && AutoSaver.hasAutoSave())
{
  Router.routeTo("/app");
}

//Setup viewport
window.addEventListener('load', (event) => {
  loadConfig();
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});
//Warn user before exit
window.addEventListener('beforeunload', (event) => {
  saveConfig();

  const message = Config.EXIT_WINDOW_MESSAGE;
  event = event || window.event;
  // For IE and Firefox
  if (e) e.returnValue = message;

  //For Safari
  return message;
});
//Service Worker
if ('serviceWorker' in navigator)
{
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
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
    ReactDOM.render(React.createElement(page, {router: Router}, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
