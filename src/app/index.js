import React from 'react';
import ReactDOM from 'react-dom';

//Changelog: imports
import Changelog from 'changelog.js';

//Router: imports
import Router from 'router.js';
import App from 'deprecated/content/App.js';
import ModuleLoader from 'modules/ModuleLoader.js';
import LandingPage from 'deprecated/landing/components/LandingPage.js';

//Config: imports
import Config from 'deprecated/config.js';
import { loadConfig, saveConfig } from 'deprecated/config.js';
const AUTOSAVE_CONFIG = true;
//LocalSave: imports
import LocalSave from 'deprecated/system/localsave/LocalSave.js';

const SHOULD_WARN_USERS_ON_EXIT = true;

//Setup viewport
window.addEventListener('load', (event) => {
  console.log("Preparing for \'" + process.env.NODE_ENV + "\' environment...");
  console.log("Loading web app version \'" + process.env.VERSION + "\'...");
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Warn user before exit
window.addEventListener('beforeunload', (event) => {
  //Config: Only save if changes were made
  if (AUTOSAVE_CONFIG) saveConfig();

  if (SHOULD_WARN_USERS_ON_EXIT && LocalSave.getStringFromStorage("disableExitWarning") !== "true")
  {
    const message = I18N.toString("alert.window.exit");
    event = event || window.event;
    // For IE and Firefox
    if (event) event.returnValue = message;

    //For Safari
    return message;
  }

  unloadApplication();
});

//Tell the client that an update is available
window.isUpdateAvailable.then(hasUpdate => {
  if (hasUpdate)
  {
    let message = "";
    if (Changelog && Changelog['show'])
    {
      message += Changelog['log'];
    }

    console.log("[App] Found update for version " + process.env.VERSION + "...");
    window.alert("*** New update available! *** \n Please restart the browser." +
      (message ? "\n" + message : ""));
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
  LocalSave.initialize();

  loadConfig();
  root = document.getElementById("root");

  //This should be the same as the one referred to by OptionsPanel
  if (LocalSave.getStringFromStorage("skipWelcome") === "true")
  {
    if (LocalSave.getStringFromStorage("enableExperimental") === "true")
    {
      import(/* webpackChunkName: "experimental" */ 'experimental/App.js')
        .then(({ default: _ }) => Router.routeTo( _ ));
    }
    else
    {
      Router.routeTo(App);
    }
  }
  else
  {
    Router.routeTo(LandingPage);
  }
}

//Update application
function updateApplication(time)
{
  dt = (time - prevtime) / FRAMES_PER_SECOND;
  {
    const page = Router.getCurrentPage();
    const pageProps = Router.getCurrentPageProps();
    if (page)
    {
      ReactDOM.render(React.createElement(page, pageProps), root);
    }
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}

//Unload application
function unloadApplication()
{
  LocalSave.terminate();
}
