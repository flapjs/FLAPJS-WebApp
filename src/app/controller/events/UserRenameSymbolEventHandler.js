import EventHandler from './EventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';
import NodalGraphParser from 'graph/NodalGraphParser.js';

class UserRenameSymbolEventHandler extends EventHandler
{
  constructor(eventLogger, machineController, graphController)
  {
    super(eventLogger, machineController, "userPreRenameSymbol", "userPostRenameSymbol");

    this.graphController = graphController;
  }

  //Override
  captureEvent(machineBuilder, symbol, prevSymbol)
  {
    const graph = this.graphController.getGraph();
    return {
      graphData: NodalGraphParser.toJSON(graph),
      symbol: symbol,
      prevSymbol: prevSymbol
    };
  }

  //Override
  capturePostEvent(machineBuilder, symbol, prevSymbol, targets)
  {
    const graph = this.graphController.getGraph();
    const targetIDs = [];

    for(const target of targets)
    {
      targetIDs.push(target.id);
    }

    return {
      graphData: NodalGraphParser.toJSON(graph),
      symbol: symbol,
      prevSymbol: prevSymbol,
      targets: targetIDs
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    //TODO: restore machine custom alphabet
    NodalGraphParser.parseJSON(e.eventData.graphData, this.graphController.getGraph());
  }

  //Override - this = event
  applyRedo(e)
  {
    //TODO: restore machine custom alphabet
    NodalGraphParser.parseJSON(e.postData.graphData, this.graphController.getGraph());
  }
}
export default UserRenameSymbolEventHandler;
