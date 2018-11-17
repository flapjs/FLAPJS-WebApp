import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';

import NodalGraph from 'graph/NodalGraph.js';

import FSABuilder from './builder/FSABuilder.js';
import MachineController from 'controller/MachineController.js';
import GraphController from 'controller/GraphController.js';
import InputController from 'controller/InputController.js';

const PANELS = [TestingPanel, OverviewPanel];

class FSAModule
{
  constructor(app)
  {
    this._graph = new NodalGraph();
    this._machineBuilder = new FSABuilder(this._graph);

    this._inputController = new InputController(this._graph);
    this._graphController = new GraphController(this._graph);
    this._machineController = new MachineController(this._machineBuilder);
  }

  initialize(app)
  {
    this._machineBuilder.initialize(app);

    //Initialize the controller to graph components
    this._inputController.initialize(app);
    this._graphController.initialize(app);
    this._machineController.initialize(app);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this._inputController.isTrashMode())
      {
        app.notification.addWarningMessage(I18N.toString("message.warning.cannotmodify"),
          "tryCreateWhileTrash", true);
      }
    };
    this._graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);
  }

  destroy(app)
  {
    this._machineController.destroy();
    this._graphController.destroy();
    this._inputController.destroy();

    this._machineBuilder.destroy();
  }

  getInputController()
  {
    return this._inputController;
  }

  getGraphController()
  {
    return this._graphController;
  }

  getMachineController()
  {
    return this._machineController;
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
