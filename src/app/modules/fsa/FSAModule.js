import AbstractModule, {DEFAULT_PANELS} from 'modules/base/AbstractModule.js';

import Notifications from 'system/notification/Notifications.js';

import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';
import AnalysisPanel from './panels/analysis/AnalysisPanel.js';
import AboutPanel from './panels/about/AboutPanel.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import FSAGraphRenderer from './renderer/FSAGraphRenderer.js';
import FSAGraphOverlayRenderer from './renderer/FSAGraphOverlayRenderer.js';
import ViewportRenderer from './renderer/ViewportRenderer.js';

import FSABuilder from './builder/FSABuilder.js';
import GraphLayout from './graph/GraphLayout.js';
import EventManager from './EventManager.js';
import LabelEditor from './editor/LabelEditor.js';
import TestingManager from './testing/TestingManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';

const VERSION = "0.0.1";
const PANELS = [AboutPanel, TestingPanel, OverviewPanel, AnalysisPanel].concat(DEFAULT_PANELS);
const EXPORTERS = [
  new FSAGraphExporter(),
  new JFLAPGraphExporter()
];

class FSAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._workspace = null;

    this._refreshRate = 60;
    this._ticks = 0;

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);

    this._machineBuilder = new FSABuilder(this._graphController.getGraph());

    this._eventManager = new EventManager(app.getUndoManager());
    this._testingManager = new TestingManager();
  }

  //Override
  initialize(app)
  {
    super.initialize(app);

    const viewport = app.viewport;
    const workspace = app.workspace;

    this._workspace = workspace;

    this._inputController.initialize(this);
    this._graphController.initialize(this);
    this._machineController.initialize(this);

    this._machineBuilder.initialize(this);

    this._eventManager.initialize(this);

    this._testingManager.initialize(this, viewport);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this._inputController.isTrashMode())
      {
        Notifications.addMessage(I18N.toString("message.warning.cannotmodify"), "warning", "tryCreateWhileTrash");
      }
    };
    this._graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);
  }

  //Override
  destroy(app)
  {
    this._testingManager.destroy();

    this._eventManager.destroy();

    this._machineBuilder.destroy();

    this._machineController.destroy();
    this._graphController.destroy();
    this._inputController.destroy();

    super.destroy(app);
  }

  //Override
  update(app)
  {
    this._inputController.update(this);
    this._graphController.update(this);

    if (--this._ticks <= 0)
    {
      this._machineBuilder.update(this);
      this._ticks = this._refreshRate;
    }
  }

  getGraph()
  {
    return this._graphController.getGraph();
  }

  getTestingManager()
  {
    return this._testingManager;
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

  getLabelEditor()
  {
    return LabelEditor;
  }

  //Override
  getRenderer(renderLayer)
  {
    switch(renderLayer)
    {
      case "graph":
        return FSAGraphRenderer;
      case "graphoverlay":
        return FSAGraphOverlayRenderer;
      case "viewport":
        return ViewportRenderer;
    }
    return null;
  }
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
  getModulePanels() { return PANELS; }
  //Override
  getModuleName() { return "fsa"; }
  //Override
  getLocalizedModuleName() { return this._machineBuilder.getMachineType(); }
}
export default FSAModule;
