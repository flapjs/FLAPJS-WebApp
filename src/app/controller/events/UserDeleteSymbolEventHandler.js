import EventHandler from './EventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';

class UserDeleteSymbolEventHandler extends EventHandler
{
  constructor(eventLogger, machineController, graphController)
  {
    super(eventLogger, machineController, "userPreDeleteSymbol", "userPostDeleteSymbol");

    this.graphController = graphController;
  }

  //Override
  captureEvent(machineBuilder, symbol)
  {
    const graph = this.graphController.getGraph();
    return {
      graphData: graph.toJSON(),
      symbol: symbol
    };
  }

  //Override
  capturePostEvent(machineBuilder, symbol, targets)
  {
    const graph = this.graphController.getGraph();
    const targetIDs = [];

    for(const target of targets)
    {
      targetIDs.push(target.id);
    }

    return {
      graphData: graph.toJSON(),
      symbol: symbol,
      targets: targetIDs
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    //TODO: restore machine custom alphabet
    NodalGraph.parseJSON(e.eventData.graphData, this.graphController.getGraph());
  }

  //Override - this = event
  applyRedo(e)
  {
    //TODO: restore machine custom alphabet
    NodalGraph.parseJSON(e.postData.graphData, this.graphController.getGraph());
  }
}
export default UserDeleteSymbolEventHandler;
