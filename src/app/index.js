import React from 'react';
import ReactDOM from 'react-dom';

//Router: imports
import Router from 'router.js';
//Config: imports
import Config from 'config.js';
import { loadConfig, saveConfig } from 'config.js';
const AUTOSAVE_CONFIG = true;

const SHOULD_WARN_USERS_ON_EXIT = true;

//Setup viewport
window.addEventListener('load', (event) => {
  console.log("Preparing for \'" + process.env.NODE_ENV + "\' environment...");
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Warn user before exit
window.addEventListener('beforeunload', (event) => {
  //Config: Only save if changes were made
  if (AUTOSAVE_CONFIG) saveConfig();

  if (SHOULD_WARN_USERS_ON_EXIT)
  {
    const message = I18N.toString("alert.window.exit");
    event = event || window.event;
    // For IE and Firefox
    if (event) event.returnValue = message;

    //For Safari
    return message;
  }
});

//Tell the client that an update is available
window.isUpdateAvailable.then(hasUpdate => {
  if (hasUpdate)
  {
    window.alert("*** Update " + process.env.VERSION + " is here! *** \n Please restart the browser.");
  }
});

//Setup application
const FRAMES_PER_SECOND = 60;
var prevtime = 0;
var root;
var dt;

//Load application
function loadApplication()
{
  loadConfig();
  root = document.getElementById("root");
  import(/* webpackChunkName: "landing" */ 'landing/components/LandingPage.js').then(({ default: _ }) => {
    Router.routeTo( _ );
  });
}

//Update application
function updateApplication(time)
{
  dt = (time - prevtime) / FRAMES_PER_SECOND;
  {
    const page = Router.getCurrentPage();
    if (page)
    {
      ReactDOM.render(React.createElement(page), root);
    }
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
