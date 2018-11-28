import BaseModule from 'modules/base/BaseModule.js';

import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';
import AnalysisPanel from './panels/analysis/AnalysisPanel.js';
import AboutPanel from './panels/about/AboutPanel.js';

import NodalGraph from 'graph/NodalGraph.js';

import FSABuilder from './builder/FSABuilder.js';

const PANELS = [TestingPanel, OverviewPanel, AnalysisPanel];

class FSAModule extends BaseModule
{
  constructor()
  {
    super();
    this._graph = new NodalGraph();
    this._machineBuilder = new FSABuilder(this._graph);
  }

  //Override
  initialize(app)
  {
    super.initialize(app);
    this._machineBuilder.initialize(app);
  }

  //Override
  destroy(app)
  {
    this._machineBuilder.destroy();
    super.destroy(app);
  }

  getGraph()
  {
    return this._graph;
  }

  getMachineBuilder()
  {
    return this._machineBuilder;
  }

  getLabelFormatter()
  {
    return this._machineBuilder.formatAlphabetString.bind(this._machineBuilder);
  }

  getModuleInfoPanel()
  {
    return AboutPanel;
  }

  //Override
  getModulePanels()
  {
    return PANELS;
  }

  //Override
  getModuleName()
  {
    return "fsa";
  }
}
export default FSAModule;
