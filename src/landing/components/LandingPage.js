import React from 'react';
import { hot } from 'react-hot-loader';
import './LandingPage.css';

import Logo from 'images/flapjs.svg';

const LAUNCH_BUTTON_TEXT = "Launch Workspace";
const SMALL_LAUNCH_BUTTON_TEXT = "Launch it!";
const SMALLER_LAUNCH_BUTTON_TEXT = "Launch.";
const SMALLEST_LAUNCH_BUTTON_TEXT = "";
const HELP_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/intro_page/src/landing/Help.md"

class LandingPage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onHelpButton(e)
  {
    const newTab = window.open(HELP_LINK, '_blank');
    newTab.focus();
  }

  render()
  {
    let launchText;

    //Smallest
    if (window.matchMedia("(max-width: 400px)").matches)
    {
      launchText = SMALLEST_LAUNCH_BUTTON_TEXT;
    }
    //Smaller
    else if (window.matchMedia("(max-width: 45em)").matches)
    {
      launchText = SMALLER_LAUNCH_BUTTON_TEXT;
    }
    //Small
    else if (window.matchMedia("(max-width: 68em)").matches)
    {
      launchText = SMALL_LAUNCH_BUTTON_TEXT;
    }
    //Default
    else
    {
      launchText = LAUNCH_BUTTON_TEXT;
    }

    return <div className="landing-container">
      <div className="content-container">
        <header>
          <img id="logo" src={Logo}/>
        </header>
        <div className="content">
          <div className="content-quote">
            "Quote me, somebody! PLEASE!"
            <label>-Andrew</label>
          </div>
          <div className="launch-container">
            <div className="set-container">
              <span className="openset">{"{"}</span>
              <button id="launch-button">
                <span>{launchText}</span>
              </button>
              <span className="closeset">{"}"}</span>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="utility">
          <div><a className="info">Report a Bug</a></div>
          <div><a className="info">About</a></div>
          <div><a className="info">Help</a></div>
        </div>
        <div className="credits">
          <span className="space"></span>
          <span className="left">
            <div>Professor</div>
            <a className="nobreak">Mia Minnes</a>
          </span>
          <span className="right">
            <div>Developers</div>
            <a>Maya</a>
            <a>Noah</a>
            <a>David</a>
            <a>Erik</a>
            <a>Lixuan</a>
            <a>Andrew</a>
          </span>
          <span className="space"></span>
        </div>

        <div>
          <a className="info">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0V0z"/>
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            Find it on <b>Github</b>
          </a>
        </div>

        <div className="subtitle-container">
          <div className="subtitle">
            &copy; 2018 University of California, San Diego
          </div>

          <div className="subtitle">
            <label>Thanks to all of you!</label>
          </div>
        </div>
      </footer>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(LandingPage);
