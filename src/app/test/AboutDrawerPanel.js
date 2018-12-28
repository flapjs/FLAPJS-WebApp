import AbstractDrawerPanel from './drawer/AbstractDrawerPanel.js';

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
}

export default AboutDrawerPanel;
