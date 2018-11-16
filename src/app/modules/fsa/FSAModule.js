import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';

const PANELS = [TestingPanel, OverviewPanel];

class FSAModule
{
  constructor()
  {

  }

  getPanels()
  {
    return PANELS;
  }

  getName()
  {
    return "fsa";
  }
}
export default FSAModule;
