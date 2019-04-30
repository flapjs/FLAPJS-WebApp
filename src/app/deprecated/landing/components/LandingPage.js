import React from 'react';
import { hot } from 'react-hot-loader/root';
import './LandingPage.css';

import Router from 'router.js';

import Logo from './Logo.js';
import Quote from './Quote.js';

import ModuleLoader from 'deprecated/modules/ModuleLoader.js';
import LocalSave from 'deprecated/system/localsave/LocalSave.js';
import App from 'deprecated/content/App.js';

const LAUNCH_BUTTON_TEXT = "Launch Workspace";
const SMALL_LAUNCH_BUTTON_TEXT = "Get Started!";
const SMALLER_LAUNCH_BUTTON_TEXT = "Proceed.";
const TUTORIAL_BUTTON_TEXT = "= Want to try our awesome tutorial? =";

const QUOTES = [
  ["Explore what it means to be \'computable\'.", "- Prof. Mia Minnes"],
  ["Lush has an interactive background in Mozilla", "- David"],
  ["Good almost afternoon (I totally didn’t just wake up).", "- Noah"],
  ["RONALDO IS MY GOD", "- David"],
  ["If you dream it, you can do it.", "- Walt Disney"],
  ["Never, never, never give up.", "- Winston Churchill"],
  ["Don't wait. The time will never be just right.", "- Napolean Hill"],
  ["I can, therefore I am.", "- Simone Wei"],
  ["Turn your wounds into wisdom.", "- Oprah Winfrey"],
  ["Believe you can and you're halfway there.", "- Theodore Roosevelt"],
  ["80% of success is showing up.", "- Woody Allen"],
  ["A jug fills drop by drop.", "- Buddha"],
  ["If you have never failed you have never lived.", "- Human"],
  ["Dream big and dare to fail.", "- Norman Vaughan"],
  ["Have faith in yourself and in the future.", "- Ted Kennedy"],
  ["It's kind of fun to do the impossible.", "- Walt Disney"],
  ["Find out who you are and do it on purpose.", "- Dolly Parton"],
  ["The only journey is the one within.", "- Rainer Maria Rilke"],
  ["Every moment is a fresh beginning.", "- T.S. Eliot"],
  ["Be willing to be a beginner every single morning.", "- Meister Eckhart"]
];
const QUOTE_INDEX = Math.floor(Math.random() * QUOTES.length);
const [CONTENT_QUOTE, CONTENT_SUBQUOTE] = QUOTES[QUOTE_INDEX];

const TUTORIAL_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md";
const HELP_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md";
const ABOUT_LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/README.md";
const REPORT_BUG_LINK = "https://goo.gl/forms/XSil43Xl5xLHsa0E2";
const GITHUB_LINK = "https://github.com/flapjs/FLAPJS-WebApp/";

const PROFMINNES_LINK = "http://cseweb.ucsd.edu/~minnes/";
const MAYA_LINK = "https://www.linkedin.com/in/maya-bello-6b8637a7/";
const NOAH_LINK = "https://www.linkedin.com/in/noah-solomon-9a8526129/";
const DAVID_LINK = "https://www.linkedin.com/in/osunadavid/";
const ERIK_LINK = "https://www.linkedin.com/in/xuanqiang-zhao-364225153/";
const LIXUAN_LINK = "https://www.linkedin.com/in/lixuan-lang-3ba206143/";
const ANDREW_LINK = "https://www.linkedin.com/in/andrew-kuo-790243132/";
const SETH_LINK = "";
const RAVNEET_LINK = "";

class LandingPage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.footer = null;
    this.returnHome = null;

    this.onLaunchButton = this.onLaunchButton.bind(this);
    this.onTutorialButton = this.onTutorialButton.bind(this);
    this.onReturnHomeButton = this.onReturnHomeButton.bind(this);
    this.onReportBugButton = this.onReportBugButton.bind(this);
    this.onAboutButton = this.onAboutButton.bind(this);
    this.onHelpButton = this.onHelpButton.bind(this);
    this.onGithubButton = this.onGithubButton.bind(this);
  }

  componentDidMount()
  {
    //Parallax effect for footer
    window.onscroll = (e) => {
      let height = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      ) - window.innerHeight;
      let scroll = window.pageYOffset;
      const value = Math.round(height - scroll) / 5;

      if (this.footer && this.returnHome)
      {
        this.footer.style.bottom = value + "px";
        this.returnHome.style.opacity = (scroll / height);
      }
    };
  }

  onLaunchButton(e)
  {
    if (!ModuleLoader.loadModuleFromStorage())
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
  }

  onTutorialButton(e)
  {
    const newTab = window.open(TUTORIAL_LINK, '_blank');
    newTab.focus();
  }

  onReturnHomeButton(e)
  {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* HEADER*/}
        <header>
          <Logo id="logo"/>
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

        <div ref={ref=>this.returnHome=ref} id="return-home">
          <svg xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            onClick={this.onReturnHomeButton}>
              <path fill="none" d="M0 0h24v24H0V0z"/>
              <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
          </svg>
        </div>
      </div>

      {/* FOOTER */}
      <footer ref={ref=>this.footer=ref}>
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
            <a onClick={()=>window.open(ANDREW_LINK, '_blank').focus()}>Andrew</a>
            <a onClick={()=>window.open(LIXUAN_LINK, '_blank').focus()}>Lixuan</a>
            <a onClick={()=>window.open(RAVNEET_LINK, '_blank').focus()}>Ravneet</a>
            <a onClick={()=>window.open(SETH_LINK, '_blank').focus()}>Seth</a>
            <div>+</div>
            <a onClick={()=>window.open(MAYA_LINK, '_blank').focus()}>Maya</a>
            <a onClick={()=>window.open(NOAH_LINK, '_blank').focus()}>Noah</a>
            <a onClick={()=>window.open(DAVID_LINK, '_blank').focus()}>David</a>
            <a onClick={()=>window.open(ERIK_LINK, '_blank').focus()}>Erik</a>
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
            {"\u00A9 2018 University of California, San Diego. All rights reserved."}
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
export default hot(LandingPage);
