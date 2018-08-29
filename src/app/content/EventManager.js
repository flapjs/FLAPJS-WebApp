import EventLogger from 'events/EventLogger.js';

import GraphEdgeCreateEvent from 'events/GraphEdgeCreateEvent.js';
import GraphEdgeDeleteEvent from 'events/GraphEdgeDeleteEvent.js';
import GraphEdgeDestinationEvent from 'events/GraphEdgeDestinationEvent.js';
import GraphEdgeLabelEvent from 'events/GraphEdgeLabelEvent.js';
import GraphEdgeMoveEvent from 'events/GraphEdgeMoveEvent.js';
import GraphNodeAcceptEvent from 'events/GraphNodeAcceptEvent.js';
import GraphNodeInitialEvent from 'events/GraphNodeInitialEvent.js';
import GraphNodeCreateEvent from 'events/GraphNodeCreateEvent.js';
import GraphNodeDeleteAllEvent from 'events/GraphNodeDeleteAllEvent.js';
import GraphNodeDeleteEvent from 'events/GraphNodeDeleteEvent.js';
import GraphNodeLabelEvent from 'events/GraphNodeLabelEvent.js';
import GraphNodeMoveEvent from 'events/GraphNodeMoveEvent.js';
import GraphNodeMoveAllEvent from 'events/GraphNodeMoveAllEvent.js';

class Events
{
  constructor()
  {
    this.graphController = null;

    this.logger = new EventLogger();
  }

  initialize(app)
  {
    this.graphController = app.graphController;
    const graph = this.graphController.getGraph();
    const events = this.logger;

    /*this.graphController.on("nodeCustomLabel", (targetNode, nextLabel, prevLabel) =>
      events.handleEvent(new GraphNodeLabelEvent(graph, targetNode, nextLabel, prevLabel)));*/
    this.graphController.on("nodeCreate", targetNode =>
      events.handleEvent(new GraphNodeCreateEvent(graph, targetNode)));
    this.graphController.on("nodeDelete", (targetNode, prevX, prevY) =>
      events.handleEvent(new GraphNodeDeleteEvent(graph, targetNode, prevX, prevY)));
    this.graphController.on("nodeDeleteAll", (targetNodes, selectedNode, prevX, prevY) =>
      events.handleEvent(new GraphNodeDeleteAllEvent(graph, targetNodes, selectedNode, prevX, prevY)));
    this.graphController.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphNodeMoveEvent(graph, targetNode, nextX, nextY, prevX, prevY)));
    this.graphController.on("nodeMoveAll", (targetNodes, dx, dy) =>
      events.handleEvent(new GraphNodeMoveAllEvent(graph, targetNodes, dx, dy)));
    this.graphController.on("nodeAccept", (targetNode, nextAccept, prevAccept) =>
      events.handleEvent(new GraphNodeAcceptEvent(graph, targetNode, nextAccept, prevAccept)));
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

  }

  destroy()
  {
    //TODO: Remove all event listeners...
    this.graphController.clearListeners();
  }

  getLogger()
  {
    return this.logger;
  }
}

export default Events;
