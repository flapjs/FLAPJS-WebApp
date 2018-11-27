import Config from 'config.js';
import Eventable from 'util/Eventable.js';

import GraphLayout from 'graph/GraphLayout.js';

import Node from './Node.js';
import Edge from './Edge.js';
import { EMPTY } from 'machine/Symbols.js';

class NodalGraph
{
  constructor(nodes=[], edges=[])
  {
    this.nodes = nodes;
    this.edges = edges;

    //nodeCreate(node) - Whenever a new node is created
    this.registerEvent("nodeCreate");
    //nodeDestroy(node) - Whenever a node is destroyed (even on clear)
    this.registerEvent("nodeDestroy");
    //nodeLabel(node, newLabel, oldLabel) - Whenever a node label changes
    this.registerEvent("nodeLabel");
    //nodeCustomLabel(node, newLabel, oldLabel) - Whenever a node custom label changes
    this.registerEvent("nodeCustomLabel");
    //edgeCreate(edge) - Whenever a new edge is created
    this.registerEvent("edgeCreate");
    //edgeDestroy(edge) - Whenever an edge is destroyed (even on clear)
    this.registerEvent("edgeDestroy");
    //edgeLabel(edge, newLabel, oldLabel) - Whenever a node label changes
    this.registerEvent("edgeLabel");
    //edgeDestination(edge, newDestination, oldDestination) - Whenever a node changes destination
    this.registerEvent("edgeDestination");
    //toggleAccept(node) - Whenever a node changes to an accept state, or vice versa
    this.registerEvent("toggleAccept");
    //newInitial(node, oldNode) - Whenever a node becomes the initial state; oldNode could be null
    this.registerEvent("newInitial");
    //markDirty(graph) - Whenever the graph is marked dirty
    this.registerEvent("markDirty");
  }

  getNodeByLabel(label)
  {
    for(const node of this.nodes)
    {
      if (node.label == label)
      {
        return node;
      }
    }

    return null;
  }

  getNodeIndexByID(id)
  {
    const length = this.nodes.length;
    for(let i = 0; i < length; ++i)
    {
      const node = this.nodes[i];
      if (node.getGraphElementID() == id)
      {
        return i;
      }
    }
    return -1;
  }

  getNodeIndex(node)
  {
    for(let i = this.nodes.length - 1; i >= 0; --i)
    {
      const other = this.nodes[i];
      if (node === other)
      {
        return i;
      }
    }
    return -1;
  }

  getNodeIndexByLabel(label)
  {
    for(let i = this.nodes.length - 1; i >= 0; --i)
    {
      const node = this.nodes[i];
      if (node.label == label)
      {
        return i;
      }
    }

    return -1;
  }

  newNode(x, y, label)
  {
    const result = new Node(this, x, y, label);
    if (this.nodes.length == 0)
    {
      this.emit("newInitial", result, null);
    }
    this.nodes.push(result);
    this.emit("nodeCreate", result);

    this.markDirty();
    return result;
  }

  deleteNode(node)
  {
    //Make sure that any connections to this node are resolved before removal
    let edge = null;
    for(let i = this.edges.length - 1; i >= 0; --i)
    {
      edge = this.edges[i];
      if (edge.from == node)
      {
        //Delete any edges that have this node as a source
        this.edges.splice(i, 1);
        this.emit("edgeDestroy", edge);
      }
      else if (edge.to == node)
      {
        //Return any edges that have this node as a destination
        edge.makePlaceholder();
      }
    }
    let nodeIndex = this.nodes.indexOf(node);
    this.nodes.splice(nodeIndex, 1);
    if (nodeIndex == 0)
    {
      this.emit("newInitial", this.getStartNode(), node);
    }
    this.emit("nodeDestroy", node);

    this.markDirty();
  }

  getEdgeIndexByID(id)
  {
    const length = this.edges.length;
    for(let i = 0; i < length; ++i)
    {
      const edge = this.edges[i];
      if (edge.getGraphElementID() == id)
      {
        return i;
      }
    }
    return -1;
  }

  newEdge(from, to, label)
  {
    //TODO: This is also in GraphController!!!
    //Look for an existing edge with similar from and to
    for(const edge of this.edges)
    {
      if (edge.from === from && edge.to === to)
      {
        let result = edge.label.split(",");
        if (label && label.length > 0)
        {
          result = result.concat(label.split(","));
          edge.setLabel(result.join(","));
          this.markDirty();
        }

        return edge;
      }
    }

    const result = new Edge(this, from, to, label);
    this.edges.push(result);

    //TODO: This is also in GraphController!!!
    //Bend away if there is another edge not bent with the same src/dst
    for(const edge of this.edges)
    {
      if (edge.isQuadratic()) continue;
      if ((edge.to === result.from && edge.from === result.to))
      {
        const HALFPI = Math.PI / 2;
        result.setQuadratic(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
        edge.setQuadratic(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
      }
    }

    if (from === to)
    {
      result.makeSelfLoop();
    }

    this.emit("edgeCreate", result);

    this.markDirty();
    return result;
  }

  deleteEdge(edge)
  {
    this.edges.splice(this.edges.indexOf(edge), 1);
    this.emit("edgeDestroy", edge);

    this.markDirty();
  }

  deleteAll()
  {
    for(let node of this.nodes)
    {
      this.emit("nodeDestroy", node);
    }
    this.nodes.length = 0;

    for(let edge of this.edges)
    {
      this.emit("edgeDestroy", edge);
    }
    this.edges.length = 0;

    this.markDirty();
  }

  isEmpty()
  {
    return this.nodes.length <= 0;
  }

  setStartNode(node)
  {
    if (this.nodes.length <= 1) return;

    this.nodes.splice(this.nodes.indexOf(node), 1);
    const prevNode = this.nodes[0];
    this.nodes.unshift(node);
    this.emit("newInitial", node, prevNode);

    this.markDirty();
  }

  getStartNode()
  {
    return this.nodes.length > 0 ? this.nodes[0] : null;
  }

  getBoundingRect()
  {
    var minNX = Number.MAX_VALUE;
    var minNY = Number.MAX_VALUE;
    var maxNX = Number.MIN_VALUE;
    var maxNY = Number.MIN_VALUE;

    this.nodes.forEach(function (node) {
      const x = node.x;
      const y = node.y;

      minNX = Math.min(minNX, x);
      maxNX = Math.max(maxNX, x);

      minNY = Math.min(minNY, y);
      maxNY = Math.max(maxNY, y);
    });

    minNX -= Config.NODE_RADIUS;
    minNY -= Config.NODE_RADIUS;
    maxNX += Config.NODE_RADIUS;
    maxNY += Config.NODE_RADIUS;

    var minEX = Number.MAX_VALUE;
    var minEY = Number.MAX_VALUE;
    var maxEX = Number.MIN_VALUE;
    var maxEY = Number.MIN_VALUE;
    this.edges.forEach(function (edge) {
      const startpoint = edge.getStartPoint();
      const endpoint = edge.getEndPoint();
      const center = edge.getCenterPoint();

      const sx = startpoint.x;
      const sy = startpoint.y;
      const ex = endpoint.x;
      const ey = endpoint.y;
      const cx = center.x;
      const cy = center.y;

      minEX = Math.min(minEX, sx, ex, cx);
      maxEX = Math.max(maxEX, sx, ex, cx);

      minEY = Math.min(minEY, sy, ey, cy);
      maxEY = Math.max(maxEY, sy, ey, cy);
    });

    const result = {
      minX: Math.min(minNX, minEX),//minNX < minEX ? minNX : minEX,
      minY: Math.min(minNY, minEY),//minNY < minEY ? minNY : minEY,
      maxX: Math.max(maxNX, maxEX),//maxNX > maxEX ? maxNX : maxEX,
      maxY: Math.max(maxNY, maxEY),//maxNY > maxEY ? maxNY : maxEY,
      width: 0,
      height: 0
    };
    result.width = result.maxX - result.minX;
    result.height = result.maxY - result.minY;
    return result;
  }

  copyGraph(graph)
  {
    this.deleteAll();
    this.nodes = this.nodes.concat(graph.nodes);
    this.edges = this.edges.concat(graph.edges);

    //Reassign all nodes and edges to new graph
    for(const node of graph.nodes)
    {
      node.graph = this;
    }
    for(const edge of graph.edges)
    {
      edge.graph = this;
    }

    this.markDirty();
  }

  copyMachine(machine)
  {
    this.deleteAll();

    //Add all states
    let node;
    for(const state of machine.getStates())
    {
      node = this.newNode(0, 0, state);
      if (machine.isFinalState(state))
      {
        node.accept = true;
      }
    }

    //Add all transitions
    let edge, from, to, read, labels, flag;
    for(let transition of machine.getTransitions())
    {
      from = this.getNodeByLabel(transition[0]);
      read = transition[1];
      to = this.getNodeByLabel(transition[2]);
      edge = this.newEdge(from, to, read);
    }

    //Set start state
    const startState = machine.getStartState();
    this.setStartNode(this.getNodeByLabel(startState));

    //Auto layout graph
    GraphLayout.applyLayout(this);

    this.markDirty();
  }

  markDirty()
  {
    this.emit("markDirty", this);
  }

  toDFA(dst=null)
  {
    throw new Error("DEPRECATED!");
  }

  toNFA(dst=null)
  {
    throw new Error("DEPRECATED!");
  }

  //TODO: NEVER CALL THIS DIRECTLY (Only FSABuilder is allowed.) Will be deprecated later.
  _toNFA(dst=null)
  {
    throw new Error("DEPRECATED!");
  }
}
//Mixin Eventable
Eventable.mixin(NodalGraph);

export default NodalGraph;
