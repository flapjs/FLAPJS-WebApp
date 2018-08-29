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
  constructor(graph, controller)
  {
    this.graph = graph;
    this.controller = controller;

    this.logger = new EventLogger();
  }

  initialize()
  {
    const graph = this.graph;
    const controller = this.controller;
    const events = this.logger;

    /*graph.on("nodeCustomLabel", (targetNode, nextLabel, prevLabel) =>
      events.handleEvent(new GraphNodeLabelEvent(graph, targetNode, nextLabel, prevLabel)));*/
    controller.on("nodeCreate", targetNode =>
      events.handleEvent(new GraphNodeCreateEvent(graph, targetNode)));
    controller.on("nodeDelete", (targetNode, prevX, prevY) =>
      events.handleEvent(new GraphNodeDeleteEvent(graph, targetNode, prevX, prevY)));
    controller.on("nodeDeleteAll", (targetNodes, selectedNode, prevX, prevY) =>
      events.handleEvent(new GraphNodeDeleteAllEvent(graph, targetNodes, selectedNode, prevX, prevY)));
    controller.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphNodeMoveEvent(graph, targetNode, nextX, nextY, prevX, prevY)));
    controller.on("nodeMoveAll", (targetNodes, dx, dy) =>
      events.handleEvent(new GraphNodeMoveAllEvent(graph, targetNodes, dx, dy)));
    controller.on("nodeAccept", (targetNode, nextAccept, prevAccept) =>
      events.handleEvent(new GraphNodeAcceptEvent(graph, targetNode, nextAccept, prevAccept)));
    controller.on("nodeInitial", (nextInitial, prevInitial) =>
      events.handleEvent(new GraphNodeInitialEvent(graph, nextInitial, prevInitial)));
    controller.on("edgeCreate", targetEdge =>
      events.handleEvent(new GraphEdgeCreateEvent(graph, targetEdge)));
    controller.on("edgeDelete", targetEdge =>
      events.handleEvent(new GraphEdgeDeleteEvent(graph, targetEdge)));
    controller.on("edgeDestination", (targetEdge, nextDestination, prevDestination, prevQuad) =>
      events.handleEvent(new GraphEdgeDestinationEvent(graph, targetEdge, nextDestination, prevDestination, prevQuad)));
    controller.on("edgeMove", (targetEdge, nextX, nextY, prevX, prevY) =>
      events.handleEvent(new GraphEdgeMoveEvent(graph, targetEdge, nextX, nextY, prevX, prevY)));
    controller.on("edgeLabel", (targetEdge, nextLabel, prevLabel) =>
      events.handleEvent(new GraphEdgeLabelEvent(graph, targetEdge, nextLabel, prevLabel)));

  }

  destroy()
  {
    //TODO: Remove all event listeners...
    this.controller.clearListeners();
  }

  getLogger()
  {
    return this.logger;
  }
}

export default Events;
