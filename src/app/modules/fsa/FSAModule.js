import BaseModule from 'modules/base/BaseModule.js';

import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';
import AnalysisPanel from './panels/analysis/AnalysisPanel.js';
import AboutPanel from './panels/about/AboutPanel.js';

import NodalGraphRenderer from './graph/renderer/NodalGraphRenderer.js';
import FSAGraph from 'modules/newfsa/graph/FSAGraph.js';
import * as FSAGraphParser from 'modules/newfsa/graph/FSAGraphParser.js';

import FSABuilder from './builder/FSABuilder.js';

const PANELS = [TestingPanel, OverviewPanel, AnalysisPanel];

class FSAModule extends BaseModule
{
  constructor()
  {
    super();
    this._graph = new FSAGraph();
    this._machineBuilder = new FSABuilder(this._graph);

    this._refreshRate = 60;
    this._ticks = 0;
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

  update(app)
  {
    if (--this._ticks <= 0)
    {
      this._machineBuilder.update();
      this._ticks = this._refreshRate;
    }
  }

  getGraph()
  {
    return this._graph;
  }

  getGraphRenderer()
  {
    return NodalGraphRenderer;
  }

  getGraphParser()
  {
    return FSAGraphParser;
  }

  getMachineBuilder()
  {
    return this._machineBuilder;
  }

  getLabelFormatter()
  {
    return this._machineBuilder.formatAlphabetString.bind(this._machineBuilder);
  }

  //Override
  getModuleTitlePanel()
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
