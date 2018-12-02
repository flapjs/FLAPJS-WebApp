import Config from 'config.js';
import Eventable from 'util/Eventable.js';

import GraphLayout from 'graph/GraphLayout.js';

import Node from './Node.js';
import Edge from './Edge.js';
import { EMPTY } from 'machine/Symbols.js';

const EDGE_SYMBOL_SEPARATOR = ",";

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
      if (node.getNodeLabel() == label)
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
      if (node.getNodeLabel() == label)
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
      if (edge.getSourceNode() == node)
      {
        //Delete any edges that have this node as a source
        this.edges.splice(i, 1);
        this.emit("edgeDestroy", edge);
      }
      else if (edge.getDestinationNode() == node)
      {
        //Return any edges that have this node as a destination
        edge.changeDestinationNode(null);
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
    const result = new Edge(this, from, to, label);
    this.edges.push(result);

    this.emit("edgeCreate", result);

    this.markDirty();
    return result;
  }

  //This is more like addEdge() without adding it to the graph and just returns the result
  //This should only be called once when completing an edge
  formatEdge(edge)
  {
    const edgeSource = edge.getSourceNode();
    const edgeDestination = edge.getDestinationNode();
    const edgeLabel = edge.getEdgeLabel().split(EDGE_SYMBOL_SEPARATOR);

    //Look for an existing edge with similar from and to
    for(const otherEdge of this.edges)
    {
      if (otherEdge === edge) continue;
      if (otherEdge.getSourceNode() === edgeSource && otherEdge.getDestinationNode() === edgeDestination)
      {
        const otherEdgeLabel = otherEdge.getEdgeLabel();
        if (edgeLabel.length > 0)
        {
          const result = otherEdgeLabel.split(EDGE_SYMBOL_SEPARATOR).concat(edgeLabel);
          otherEdge.setEdgeLabel(result.join(EDGE_SYMBOL_SEPARATOR));
        }

        //Merged with newfound edge...
        return otherEdge;
      }
    }

    //Otherwise, format the current edge

    if (!edge.isSelfLoop())
    {
      let flag = false;

      //Bend away if there is another edge not bent with the same src/dst
      const parallelEdgeHeight = Config.PARALLEL_EDGE_HEIGHT;
      const HALFPI = Math.PI / 2;
      for(const otherEdge of this.edges)
      {
        if (otherEdge.isQuadratic() && Math.abs(otherEdge.getQuadratic().length) >= parallelEdgeHeight * 2) continue;
        if ((otherEdge.getDestinationNode() === edgeSource && otherEdge.getSourceNode() === edgeDestination))
        {
          edge.setQuadratic(HALFPI, parallelEdgeHeight);
          otherEdge.setQuadratic(HALFPI, parallelEdgeHeight);
          flag = true;

          //ASSUMES that there will only ever be 2 edges that are parallel...
          break;
        }
      }

      //Try to move the edge away from intersecting nodes...
      if (!flag)
      {
        const x1 = edgeSource.x;
        const y1 = edgeSource.y;
        const x2 = edgeDestination.x;
        const y2 = edgeDestination.y;
        const dist12sq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        let vertical = false;
        let m = 0;
        let b = 0;

        if(x1 > x2)
        {
          m = (y1-y2) / (x1-x2);
          b = y2-m*x2;
        }
        else if (x1 < x2)
        {
          m = (y2-y1) / (x2-x1);
          b = y1-m*x1;
        }
        else
        {
          vertical = true;
        }

        for(const node of this.nodes)
        {
          if(node === edgeSource || node === edgeDestination) continue;

          const x0 = node.x;
          const y0 = node.y;

          const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
          const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
          if(dist01sq > dist12sq || dist02sq > dist12sq) continue;

          let dist = 0;
          if(vertical) {
            dist = Math.abs(x1-x0);
          } else {
            dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
          }

          if(dist < Config.NODE_RADIUS)
          {
            flag = true;
            break;
          }
        }

        if (flag)
        {
          edge.setQuadratic(-Math.PI / 2, Config.NODE_RADIUS + 10);
        }
      }
    }

    return edge;
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
