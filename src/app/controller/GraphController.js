import Config from 'config.js';

import Eventable from 'util/Eventable.js';

import Uploader from './Uploader.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

import GraphLayout from "graph/GraphLayout.js";
import GraphAdapter from './GraphAdapter.js';

class GraphController
{
  constructor(graph)
  {
    this.graph = graph;
    this._adapter = new GraphAdapter(this);

    this.notification = null;
    this.inputController = null;
    this.machineController = null;

    this.labelEditor = null;
    this.tester = null;
    this.uploader = new Uploader(this);

    this.prevQuad = {
      radians: 0, length: 0,
      x: 0, y: 0
    };
    this.prevEdgeTo = null;
    this.prevX = 0;
    this.prevY = 0;

    //The difference between controller events vs graph events is: controller has user-intent

    //userCreateNode(graph, node) - When user creates a node
    this.registerEvent("userCreateNode");
    this.registerEvent("userPreCreateNode");//(graph, nextNodeID, x, y)
    this.registerEvent("userPostCreateNode");//(graph, node)

    //userToggleNode(graph, node, prevAccept) - When user toggles the accept state
    this.registerEvent("userToggleNode");

    //userDeleteNodes(graph, node, targetNodes, prevX, prevY) - When user deletes one or more nodes
    this.registerEvent("userDeleteNodes");
    this.registerEvent("userPreDeleteNodes");
    this.registerEvent("userPostDeleteNodes");

    //userDeleteEdge(graph, edge, prevTo, prevQuad) - When user deletes an edge
    this.registerEvent("userDeleteEdge");
    this.registerEvent("userPreDeleteEdge");
    this.registerEvent("userPostDeleteEdge");

    //userCreateEdge(graph, edge) - When user creates an edge, after naming it
    this.registerEvent("userCreateEdge");
    //this.registerEvent("userPreCreateEdge");
    this.registerEvent("userPostCreateEdge");

    /*
    //userMoveNodes(graph, nodes, dx, dy) - When user moves one or more nodes
    this.registerEvent("userMoveNodes");
    //userMoveInitial(graph, node, prevNode) - When user moves the initial marker to another
    this.registerEvent("userMoveInitial");
    //userPreCreateEdge(graph, edge) - When user is about to create an edge, before src
    this.registerEvent("userPreCreateEdge");
    //userBeginEdge(graph, edge, src) - When user begins to create an edge, after src and before naming it
    this.registerEvent("userBeginEdge");
    //userEndEdge(graph, edge, src, dst) - When user finishes creating an edge, after dst and before naming it (dst could be null for deletion)
    this.registerEvent("userEndEdge");
    //userPostCreateEdge(graph, edge) - When user is finished creating an edge, after dst and after quad changes
    this.registerEvent("userPostCreateEdge");
    //userMoveEdge(graph, edge, prevDest) - When user changes the dst of edge
    this.registerEvent("userChangeEdge");
    //userBendEdge(graph, edge, prevQuad) - When user bends the edge
    this.registerEvent("userBendEdge");
    //userLabelEdge(graph, edge, prevLabel) - When user re-labels the edge
    this.registerEvent("userLabelEdge");
    */

    //userSwapNodes(graph, node, otherNode) - When user swap node indices
    this.registerEvent("userSwapNodes");

    //userRenameNode(graph, node, nextLabel, prevLabel, isPrevCustom) - When user sets the label of node
    this.registerEvent("userRenameNode");

    //userChangeLayout(graph, prevLayout) - When user re-layouts the graph
    this.registerEvent("userChangeLayout");
    this.registerEvent("userPreChangeLayout");//before any changes
    this.registerEvent("userPostChangeLayout");//after all changes

    //userImportGraph(graph) - When user imports a graph
    this.registerEvent("userImportGraph");
    this.registerEvent("userPreImportGraph");//before any changes
    this.registerEvent("userPostImportGraph");//after all changes

    //nodeMove(targetNode, nextX, nextY, prevX, prevY)
    this.registerEvent("nodeMove");
    //nodeMoveAll(targetNodes, dx, dy)
    this.registerEvent("nodeMoveAll");
    //nodeInitial(nextInitial, prevInitial)
    this.registerEvent("nodeInitial");
    //edgeDestination(targetEdge, nextDestination, prevDestination, prevQuad)
    this.registerEvent("edgeDestination");
    //edgeMove(targetEdge, nextQuad, prevQuad)
    this.registerEvent("edgeMove");
    //edgeLabel(targetEdge, nextLabel, prevLabel)
    this.registerEvent("edgeLabel");
    //tryCreateWhileTrash()
    this.registerEvent("tryCreateWhileTrash");
  }

  initialize(app)
  {
    this.labelEditor = app.viewport.labelEditor;
    this.tester = app.testingManager;
    this.notification = app.notification;

    this.inputController = app.inputController;
    this.machineController = app.machineController;

    this.uploader.setMachineController(this.machineController);

    this._adapter.initialize(app);
  }

  destroy()
  {
    this._adapter.destroy();
  }

  getGraph()
  {
    return this.graph;
  }

  getLabelEditor()
  {
    return this.labelEditor;
  }

  getUploader()
  {
    return this.uploader;
  }

  applyAutoLayout()
  {
    this.emit("userPreChangeLayout", this.graph);

    GraphLayout.applyLayout(this.graph);

    this.emit("userChangeLayout", this.graph);
    this.emit("userPostChangeLayout", this.graph);
  }

  renameNode(node, name)
  {
    const prev = node.label;
    const isPrevCustom = node.hasCustomLabel();

    node.setCustomLabel(name);

    this.emit("userRenameNode", this.graph, node, name, prev, isPrevCustom);
  }

  swapNodeByIndex(nodeIndex, otherNodeIndex)
  {
    const node = this.graph.nodes[nodeIndex];
    const other = this.graph.nodes[otherNodeIndex];
    this.graph.nodes[otherNodeIndex] = node;
    this.graph.nodes[nodeIndex] = other;

    this.emit("userSwapNodes", this.graph, node, other);
  }

  createNode(x, y)
  {
    const newNodeLabel = this.machineController.getMachineBuilder().getLabeler().getNextDefaultNodeLabel();

    if (typeof x === 'undefined') x = (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    if (typeof y === 'undefined') y = (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;

    this.emit("userPreCreateNode", this.graph, newNodeLabel, x, y);

    const node = this.graph.newNode(x, y, newNodeLabel);
    node.x = x;
    node.y = y;

    this.emit("userCreateNode", this.graph, node);

    this.emit("userPostCreateNode", this.graph, node);
    return node;
  }

  toggleNode(node)
  {
    const prev = node.accept;
    const result = !node.accept;
    //Toggle accept for selected node
    node.accept = result;

    //Emit event
    this.emit("userToggleNode", this.graph, node, prev);
  }

  deleteSelectedNodes(selectedNode)
  {
    const picker = this.inputController.getPicker();
    const selection = picker.getSelection().slice();

    this.emit("userPreDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);

    //Remove from graph
    for(const node of selection)
    {
      this.graph.deleteNode(node);
    }

    //Remove from selection
    picker.clearSelection();

    //Emit event
    this.emit("userDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);
    this.emit("userPostDeleteNodes", this.graph, selectedNode, selection, this.prevX, this.prevY);
  }

  deleteTargetNode(target)
  {
    this.emit("userPreDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);

    this.graph.deleteNode(target);

    //Emit event
    this.emit("userDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);
    this.emit("userPostDeleteNodes", this.graph, target, [target], this.prevX, this.prevY);
  }

  deleteTargetEdge(target)
  {
    this.emit("userPreDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
    this.graph.deleteEdge(target);

    //Emit event
    this.emit("userDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
    this.emit("userPostDeleteEdge", this.graph, target, this.prevEdgeTo, this.prevQuad);
  }

  moveNodeTo(pointer, node, x, y)
  {
    for(const other of this.graph.nodes)
    {
      //Update node collision
      if (node === other) continue;

      const dx = x - other.x;
      const dy = y - other.y;
      const angle = Math.atan2(dy, dx);

      const diameter = (Config.NODE_RADIUS * 2);
      const nextDX = other.x + (Math.cos(angle) * diameter) - x;
      const nextDY = other.y + (Math.sin(angle) * diameter) - y;

      if (dx * dx + dy * dy < Config.NODE_RADIUS_SQU * 4)
      {
        x += nextDX;
        y += nextDY;
      }
    }

    node.x = x;
    node.y = y;
  }

  moveMultipleNodesTo(pointer, nodes, x, y)
  {
    //Moves all nodes by difference between initial position with passed-in x and y
    const dx = x - pointer.initial.x;
    const dy = y - pointer.initial.y;
    for(const node of nodes)
    {
      node.x += dx;
      node.y += dy;
    }

    //Updates initial position to passed-in x and y to maintain relative position
    pointer.initial.x = x;
    pointer.initial.y = y;
  }

  moveEdgeTo(pointer, edge, x, y)
  {
    edge.setQuadraticByPosition(x, y);
  }

  moveEndpointTo(pointer, edge, x, y)
  {
    //Get ONLY node at x and y (cannot use hover target, since it is not ONLY nodes)
    const picker = this.inputController.getPicker();
    const dst = picker.getNodeAt(x, y) || pointer;
    edge._to = dst;

    //If the cursor returns to the state after leaving it...
    if (edge.isSelfLoop())
    {
      //Make it a self loop
      const dx = edge.from.x - x;
      const dy = edge.from.y - y;
      const angle = Math.atan2(dy, dx);
      edge.makeSelfLoop(angle);
    }
    //Otherwise, maintain original curve
    else
    {
      edge.copyQuadraticsFrom(this.prevQuad);
    }
  }

  openLabelEditor(target, x, y, placeholder=null, replace=true, callback=null)
  {
    const prevLabel = placeholder || target.label;
    this.labelEditor.openEditor(target, placeholder, replace, () => {
      const label = target.label;
      if (prevLabel.length > 0 && label != prevLabel)
      {
        this.emit("edgeLabel", target, label, prevLabel);
      }

      if (callback)
      {
        callback();
      }
    });
  }

  focusOnNode(node)
  {
    //Center workspace at focused node; inverted due to graph-to-screen space
    this.inputController.getViewport().setOffset(-node.x, -node.y);
  }

  focusOnEdge(edge)
  {
    //Center workspace at focused edge; inverted due to graph-to-screen space
    const center = edge.getCenterPoint();
    this.inputController.getViewport().setOffset(-center.x, -center.y);
  }

  focusOnNodes(nodes)
  {
    //Center workspace at the average of focused nodes; inverted due to graph-to-screen space
    const length = nodes.length;
    let ax = 0;
    let ay = 0;
    for(const node of nodes)
    {
      ax += node.x;
      ay += node.y;
    }
    this.inputController.getViewport().setOffset(-ax / length, -ay / length);
  }
}
//Mixin Eventable
Eventable.mixin(GraphController);

function moveNodesOutOfEdges(target, graph)
{

  const x1 = target.from.x;
  const y1 = target.from.y;
  const x2 = target.to.x;
  const y2 = target.to.y;
  const dist12sq = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
  let vertical = false;
  let m = 0;
  let b = 0;
  if(x1 > x2) {
    m = (y1-y2) / (x1-x2);
    b = y2-m*x2;
  } else if (x1 < x2) {
    m = (y2-y1) / (x2-x1);
    b = y1-m*x1;
  } else {
    vertical = true;
  }

  for(const node of graph.nodes)
  {
    if(node === target.from || node === target.to) continue;

    const x0 = node.x;
    const y0 = node.y;

    const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
    const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
    if(dist01sq > dist12sq || dist02sq > dist12sq) continue;


    let dist = 0;
    let xint = 0;
    let yint = 0;
    let m0 = 0;
    let horizontal = false;
    if(vertical) {
      dist = Math.abs(x1-x0);
      xint = x1;
      yint = y0;
      m0 = 0;
    } else {
      dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
      xint = (x0 + m*y0 - m*b) / (m*m + 1);
      yint = m * xint + b;
      if(m !== 0) {
        m0 = 1 / m;
      } else {
        horizontal = true;
      }
    }

    if(dist < Config.NODE_RADIUS) {
      const toMove = Config.NODE_RADIUS - dist + 10;
      const distx = x0 - xint;
      const disty = y0 - yint;
      let signx = -1;
      let signy = -1;
      if(distx > 0) signx = 1;
      if(disty > 0) signy = 1;

      if(horizontal) {
        node.y = y0 + signy * toMove;
      } else {
        let toMovex = toMove / Math.sqrt(m0*m0 + 1);
        let toMovey = Math.abs(m0) * toMovex;
        node.x = x0 + signx * toMovex;
        node.y = y0 + signy * toMovey;
      }
    }
  }
}

export default GraphController;
