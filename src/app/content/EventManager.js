import EventLogger from 'events/EventLogger.js';

import GraphEdgeDestinationEvent from 'events/GraphEdgeDestinationEvent.js';
import GraphEdgeLabelEvent from 'events/GraphEdgeLabelEvent.js';
import GraphEdgeMoveEvent from 'events/GraphEdgeMoveEvent.js';
import GraphNodeInitialEvent from 'events/GraphNodeInitialEvent.js';
import GraphNodeMoveEvent from 'events/GraphNodeMoveEvent.js';
import GraphNodeMoveAllEvent from 'events/GraphNodeMoveAllEvent.js';

import UserCreateNodeEventHandler from 'modules/fsa/controller/events/UserCreateNodeEventHandler.js';
import UserToggleNodeEventHandler from 'modules/fsa/controller/events/UserToggleNodeEventHandler.js';
import UserDeleteNodesEventHandler from 'modules/fsa/controller/events/UserDeleteNodesEventHandler.js';
import UserSwapNodesEventHandler from 'modules/fsa/controller/events/UserSwapNodesEventHandler.js';
import UserRenameNodeEventHandler from 'modules/fsa/controller/events/UserRenameNodeEventHandler.js';

import UserCreateEdgeEventHandler from 'modules/fsa/controller/events/UserCreateEdgeEventHandler.js';
import UserDeleteEdgeEventHandler from 'modules/fsa/controller/events/UserDeleteEdgeEventHandler.js';
import UserImportGraphEventHandler from 'modules/fsa/controller/events/UserImportGraphEventHandler.js';
import SafeGraphEventHandler from 'modules/fsa/controller/events/SafeGraphEventHandler.js';

import UserChangeMachineEventHandler from 'modules/fsa/controller/events/UserChangeMachineEventHandler.js';
import UserConvertMachineEventHandler from 'modules/fsa/controller/events/UserConvertMachineEventHandler.js';
import UserRenameMachineEventHandler from 'modules/fsa/controller/events/UserRenameMachineEventHandler.js';
import UserRenameSymbolEventHandler from 'modules/fsa/controller/events/UserRenameSymbolEventHandler.js';
import UserDeleteSymbolEventHandler from 'modules/fsa/controller/events/UserDeleteSymbolEventHandler.js';

class EventManager
{
  constructor()
  {
    this.graphController = null;
    this.machineController = null;

    this.eventHandlers = [];

    this.logger = new EventLogger();
  }

  initialize(app)
  {
    this.graphController = app.graphController;
    this.machineController = app.machineController;

    const graph = this.graphController.getGraph();
    const events = this.logger;

    this.graphController.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphNodeMoveEvent(graph, targetNode, nextX, nextY, prevX, prevY)));
    this.graphController.on("nodeMoveAll", (targetNodes, dx, dy) =>
      events.handleEvent(new GraphNodeMoveAllEvent(graph, targetNodes, dx, dy)));
    this.graphController.on("nodeInitial", (nextInitial, prevInitial) =>
      events.handleEvent(new GraphNodeInitialEvent(graph, nextInitial, prevInitial)));
    this.graphController.on("edgeDestination", (targetEdge, nextDestination, prevDestination, prevQuad) =>
      events.handleEvent(new GraphEdgeDestinationEvent(graph, targetEdge, nextDestination, prevDestination, prevQuad)));
    this.graphController.on("edgeMove", (targetEdge, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphEdgeMoveEvent(graph, targetEdge, nextX, nextY, prevX, prevY)));
    this.graphController.on("edgeLabel", (targetEdge, nextLabel, prevLabel) =>
      events.handleEvent(new GraphEdgeLabelEvent(graph, targetEdge, nextLabel, prevLabel)));

    this.eventHandlers.push(new UserCreateNodeEventHandler(events, this.graphController));
    this.eventHandlers.push(new UserRenameNodeEventHandler(events, this.graphController));
    this.eventHandlers.push(new UserSwapNodesEventHandler(events, this.graphController));
    this.eventHandlers.push(new UserToggleNodeEventHandler(events, this.graphController));
    this.eventHandlers.push(new UserDeleteNodesEventHandler(events, this.graphController));

    this.eventHandlers.push(new UserCreateEdgeEventHandler(events, this.graphController));
    this.eventHandlers.push(new UserDeleteEdgeEventHandler(events, this.graphController));

    this.eventHandlers.push(new UserImportGraphEventHandler(events, this.graphController, this.machineController));
    this.eventHandlers.push(new SafeGraphEventHandler(events, this.graphController, "userPreChangeLayout", "userPostChangeLayout"));

    this.eventHandlers.push(new UserChangeMachineEventHandler(events, this.machineController));
    this.eventHandlers.push(new UserConvertMachineEventHandler(events, this.machineController, this.graphController));
    this.eventHandlers.push(new UserRenameMachineEventHandler(events, this.machineController));
    this.eventHandlers.push(new UserRenameSymbolEventHandler(events, this.machineController, this.graphController));
    this.eventHandlers.push(new UserDeleteSymbolEventHandler(events, this.machineController, this.graphController));
  }

  destroy()
  {
    for(const handler of this.eventHandlers)
    {
      handler.destroy();
    }

    //TODO: Remove all event listeners...
    this.graphController.clearEventListeners();
  }

  getLogger()
  {
    return this.logger;
  }
}

export default EventManager;
