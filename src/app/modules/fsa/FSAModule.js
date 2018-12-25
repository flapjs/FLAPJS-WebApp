import BaseModule from 'modules/base/BaseModule.js';

import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';
import AnalysisPanel from './panels/analysis/AnalysisPanel.js';
import AboutPanel from './panels/about/AboutPanel.js';

import FSAGraphRenderer from './graph/renderer/FSAGraphRenderer.js';
import FSAGraph from 'modules/fsa/graph/FSAGraph.js';

import FSABuilder from './builder/FSABuilder.js';
import GraphLayout from './graph/GraphLayout.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';

const VERSION = "0.0.1";
const PANELS = [TestingPanel, OverviewPanel, AnalysisPanel];
const EXPORTERS = [
  new FSAGraphExporter(),
  new JFLAPGraphExporter()
];

class FSAModule extends BaseModule
{
  constructor(app)
  {
    super();
    this._graph = new FSAGraph();
    this._machineBuilder = new FSABuilder(this._graph);

    this._refreshRate = 60;
    this._ticks = 0;

    this._machineController = app.getMachineController();
    this._graphController = app.getGraphController();
    this._inputController = app.getInputController();
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

  getDefaultGraphLayout()
  {
    return GraphLayout;
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
  getGraphRenderer() { return FSAGraphRenderer; }
  //Override
  getInputController() { return this._inputController; }
  //Override
  getGraphController() { return this._graphController; }
  //Override
  getMachineController() { return this._machineController; }
  //Override
  getDefaultGraphExporter() { return EXPORTERS[0]; }
  //Override
  getGraphExporters() { return EXPORTERS; }
  //Override
  getModuleVersion() { return VERSION; }
  //Override
  getDefaultModulePanel() { return AboutPanel; }
  //Override
  getModulePanels() { return PANELS; }
  //Override
  getModuleName() { return "fsa"; }
}
export default FSAModule;
