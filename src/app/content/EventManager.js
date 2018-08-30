import EventLogger from 'events/EventLogger.js';

import GraphEdgeCreateEvent from 'events/GraphEdgeCreateEvent.js';
import GraphEdgeDeleteEvent from 'events/GraphEdgeDeleteEvent.js';
import GraphEdgeDestinationEvent from 'events/GraphEdgeDestinationEvent.js';
import GraphEdgeLabelEvent from 'events/GraphEdgeLabelEvent.js';
import GraphEdgeMoveEvent from 'events/GraphEdgeMoveEvent.js';
import GraphNodeInitialEvent from 'events/GraphNodeInitialEvent.js';
import GraphNodeMoveEvent from 'events/GraphNodeMoveEvent.js';
import GraphNodeMoveAllEvent from 'events/GraphNodeMoveAllEvent.js';

import UserCreateNodeEventHandler from 'controller/events/UserCreateNodeEventHandler.js';
import UserToggleNodeEventHandler from 'controller/events/UserToggleNodeEventHandler.js';
import UserImportGraphEventHandler from 'controller/events/UserImportGraphEventHandler.js';
import UserDeleteNodesEventHandler from 'controller/events/UserDeleteNodesEventHandler.js';
import UserSwapNodesEventHandler from 'controller/events/UserSwapNodesEventHandler.js';
import UserRenameNodeEventHandler from 'controller/events/UserRenameNodeEventHandler.js';
import SafeGraphEventHandler from 'controller/events/SafeGraphEventHandler.js';

import UserChangeMachineEventHandler from 'controller/events/UserChangeMachineEventHandler.js';
import UserConvertMachineEventHandler from 'controller/events/UserConvertMachineEventHandler.js';
import UserRenameMachineEventHandler from 'controller/events/UserRenameMachineEventHandler.js';

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

    /*this.graphController.on("nodeCustomLabel", (targetNode, nextLabel, prevLabel) =>
      events.handleEvent(new GraphNodeLabelEvent(graph, targetNode, nextLabel, prevLabel)));*/
    this.graphController.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphNodeMoveEvent(graph, targetNode, nextX, nextY, prevX, prevY)));
    this.graphController.on("nodeMoveAll", (targetNodes, dx, dy) =>
      events.handleEvent(new GraphNodeMoveAllEvent(graph, targetNodes, dx, dy)));
    this.graphController.on("nodeInitial", (nextInitial, prevInitial) =>
      events.handleEvent(new GraphNodeInitialEvent(graph, nextInitial, prevInitial)));
    this.graphController.on("edgeCreate", targetEdge =>
      events.handleEvent(new GraphEdgeCreateEvent(graph, targetEdge)));
    this.graphController.on("edgeDelete", targetEdge =>
      events.handleEvent(new GraphEdgeDeleteEvent(graph, targetEdge)));
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
    this.eventHandlers.push(new UserImportGraphEventHandler(events, this.graphController, this.machineController));
    this.eventHandlers.push(new SafeGraphEventHandler(events, this.graphController, "userPreChangeLayout", "userPostChangeLayout"));

    this.eventHandlers.push(new UserChangeMachineEventHandler(events, this.machineController));
    this.eventHandlers.push(new UserConvertMachineEventHandler(events, this.machineController, this.graphController));
    this.eventHandlers.push(new UserRenameMachineEventHandler(events, this.machineController));
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
