import React from 'react';
import { hot } from 'react-hot-loader';
import './LandingPage.css';

import Logo from 'images/flapjs.svg';

import Quote from './Quote.js';

const LAUNCH_BUTTON_TEXT = "Launch Workspace";
const SMALL_LAUNCH_BUTTON_TEXT = "Get Started!";
const SMALLER_LAUNCH_BUTTON_TEXT = "Proceed.";
const TUTORIAL_BUTTON_TEXT = "= Want to try our awesome tutorial? =";

const CONTENT_QUOTE = "Explore what it means to be \'computable\'.";
const CONTENT_SUBQUOTE = "- Prof. Mia Minnes";

const TUTORIAL_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/HELP.md";
const HELP_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/HELP.md";
const ABOUT_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/README.md";
const REPORT_BUG_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const GITHUB_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";

const PROFMINNES_LINK = "http://cseweb.ucsd.edu/~minnes/";
const MAYA_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const NOAH_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const DAVID_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const ERIK_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const LIXUAN_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";
const ANDREW_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";

class LandingPage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onLaunchButton = this.onLaunchButton.bind(this);
    this.onTutorialButton = this.onTutorialButton.bind(this);
    this.onReturnHomeButton = this.onReturnHomeButton.bind(this);
    this.onReportBugButton = this.onReportBugButton.bind(this);
    this.onAboutButton = this.onAboutButton.bind(this);
    this.onHelpButton = this.onHelpButton.bind(this);
    this.onGithubButton = this.onGithubButton.bind(this);
  }

  onLaunchButton(e)
  {
    const timeout = 300;
    const element = document.body;
    element.style.animation = "fadeout " + timeout + "ms ease forwards";

    setTimeout(() => {
      window.location.href = "dist/app.html";
    }, timeout);
  }

  onTutorialButton(e)
  {
    const newTab = window.open(TUTORIAL_LINK, '_blank');
    newTab.focus();
  }

  onReturnHomeButton(e)
  {
    window.scrollTo(0, 0);
  }

  onReportBugButton(e)
  {
    const newTab = window.open(REPORT_BUG_LINK, '_blank');
    newTab.focus();
  }

  onAboutButton(e)
  {
    const newTab = window.open(ABOUT_LINK, '_blank');
    newTab.focus();
  }

  onHelpButton(e)
  {
    const newTab = window.open(HELP_LINK, '_blank');
    newTab.focus();
  }

  onGithubButton(e)
  {
    const newTab = window.open(GITHUB_LINK, '_blank');
    newTab.focus();
  }

  render()
  {
    let launchText;

    //Smallest
    if (window.matchMedia("(max-width: 400px)").matches)
    {
      launchText = "";
    }
    //Smaller
    else if (window.matchMedia("(max-width: 760px)").matches)
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

        {/* HEADER */}
        <header>
          <img id="logo" src={Logo}/>
        </header>

        {/* CONTENT */}
        <div className="content">
          <div className="content-quote-container">
            <Quote value={CONTENT_QUOTE} label={CONTENT_SUBQUOTE} />
          </div>
          <div className="launch-container">
            <div className="set-container">
              <span className="openset">{"{"}</span>
              <button id="launch-button" onClick={this.onLaunchButton}>
                {launchText}
              </button>
              <span className="closeset">{"}"}</span>
            </div>
            <div id="tutorial-button-container">
              <button id="tutorial-button" onClick={this.onTutorialButton}>
                {TUTORIAL_BUTTON_TEXT}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div id="return-home">
          <svg xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            onClick={this.onReturnHomeButton}>
              <path fill="none" d="M0 0h24v24H0V0z"/>
              <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
          </svg>
        </div>
        <div className="utility">
          <div><a className="info" onClick={this.onReportBugButton}>Report a Bug</a></div>
          <div><a className="info" onClick={this.onAboutButton}>About</a></div>
          <div><a className="info" onClick={this.onHelpButton}>Help</a></div>
        </div>
        <div className="credits">
          <span className="space"></span>
          <span className="left">
            <div>Professor</div>
            <a className="nobreak" onClick={()=>window.open(PROFMINNES_LINK, '_blank').focus()}>Mia Minnes</a>
          </span>
          <span className="right">
            <div>Developers</div>
            <a onClick={()=>window.open(MAYA_LINK, '_blank').focus()}>Maya</a>
            <a onClick={()=>window.open(NOAH_LINK, '_blank').focus()}>Noah</a>
            <a onClick={()=>window.open(DAVID_LINK, '_blank').focus()}>David</a>
            <a onClick={()=>window.open(ERIK_LINK, '_blank').focus()}>Erik</a>
            <a onClick={()=>window.open(LIXUAN_LINK, '_blank').focus()}>Lixuan</a>
            <a onClick={()=>window.open(ANDREW_LINK, '_blank').focus()}>Andrew</a>
          </span>
          <span className="space"></span>
        </div>

        <div>
          <a className="info" onClick={this.onGithubButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0V0z"/>
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            Find it on <b>GitHub</b>
          </a>
        </div>

        <div className="subtitle-container">
          <div className="subtitle">
            {"&copy; 2018 University of California, San Diego. All rights reserved."}
          </div>
          <div className="subtitle">
            <label>{"Thank you for reading me! Stay amazing!"}</label>
          </div>
        </div>
      </footer>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(LandingPage);
