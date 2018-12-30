import AbstractDrawerPanel from './drawer/AbstractDrawerPanel.js';
import AboutPanel from './AboutPanel.js';

class AboutDrawerPanel extends AbstractDrawerPanel
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "About";
  }

  //Override
  getComponentClass()
  {
    return AboutPanel;
  }
}

export default AboutDrawerPanel;
