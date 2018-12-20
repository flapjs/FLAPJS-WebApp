import Config from 'config.js';
import Eventable from 'util/Eventable.js';

import GraphLayout from 'modules/fsa/graph/GraphLayout.js';

import Node from './Node.js';
import Edge from './Edge.js';
import { EMPTY } from 'machine/Symbols.js';

const EDGE_SYMBOL_SEPARATOR = Config.EDGE_SYMBOL_SEPARATOR;

class NodalGraph
{
  constructor(nodes=[], edges=[])
  {
    this._nodes = nodes;
    this._edges = edges;

    this._dirty = false;
    this._callbacks = [];
    this._timeout = null;
  }

  get nodes() { return this._nodes; }
  get edges() { return this._edges; }

  addGraphCallback(callback) { this._callbacks.push(callback); }
  removeGraphCallback(callback){ this._callbacks.splice(this._callbacks.indexOf(callback), 1);}
  getEdges(){return this._edges;}
  getNodes(){return this._nodes;}

  getNodeByLabel(label)
  {
    for(const node of this._nodes)
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
    const length = this._nodes.length;
    for(let i = 0; i < length; ++i)
    {
      const node = this._nodes[i];
      if (node.getGraphElementID() == id)
      {
        return i;
      }
    }
    return -1;
  }

  getNodeIndex(node)
  {
    for(let i = this._nodes.length - 1; i >= 0; --i)
    {
      const other = this._nodes[i];
      if (node === other)
      {
        return i;
      }
    }
    return -1;
  }

  getNodeIndexByLabel(label)
  {
    for(let i = this._nodes.length - 1; i >= 0; --i)
    {
      const node = this._nodes[i];
      if (node.getNodeLabel() == label)
      {
        return i;
      }
    }

    return -1;
  }

  getReachableState()
  {
    let reachable = []
    let startNode = this.getStartNode();
    reachable.push(startNode);
    for(let i = 0; i < reachable.length; i++)
    {
      for (const edge of this._edges)
      {
        if(edge.from == reachable[i])
        {
          if(!reachable.includes(edge.to))
          {
            reachable.push(edge.to);
          }
        }
      }
    }
    return reachable
  }

  newNode(x, y, label)
  {
    const result = new Node(this, x, y, label);
    this._nodes.push(result);

    this.markDirty();
    return result;
  }

  deleteNode(node)
  {
    //Make sure that any connections to this node are resolved before removal
    let edge = null;
    for(let i = this._edges.length - 1; i >= 0; --i)
    {
      edge = this._edges[i];
      if (edge.getSourceNode() == node)
      {
        //Delete any edges that have this node as a source
        this._edges.splice(i, 1);
      }
      else if (edge.getDestinationNode() == node)
      {
        //Return any edges that have this node as a destination
        edge.changeDestinationNode(null);
      }
    }
    let nodeIndex = this._nodes.indexOf(node);
    this._nodes.splice(nodeIndex, 1);

    this.markDirty();
  }

  getEdgeIndexByID(id)
  {
    const length = this._edges.length;
    for(let i = 0; i < length; ++i)
    {
      const edge = this._edges[i];
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
    this._edges.push(result);

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
    for(const otherEdge of this._edges)
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
      for(const otherEdge of this._edges)
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

        for(const node of this._nodes)
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
    this._edges.splice(this._edges.indexOf(edge), 1);

    this.markDirty();
  }

  deleteAll()
  {
    this._nodes.length = 0;
    this._edges.length = 0;

    this.markDirty();
  }

  isEmpty()
  {
    return this._nodes.length <= 0;
  }

  setStartNode(node)
  {
    if (this._nodes.length <= 1) return;

    this._nodes.splice(this._nodes.indexOf(node), 1);
    const prevNode = this._nodes[0];
    this._nodes.unshift(node);

    this.markDirty();
  }

  getStartNode()
  {
    return this._nodes.length > 0 ? this._nodes[0] : null;
  }

  getBoundingRect()
  {
    if (this._nodes.length <= 0) return {
      minX: 0, minY: 0, maxX: 1, maxY: 1, width: 1, height: 1
    };

    var minNX = Number.MAX_VALUE;
    var minNY = Number.MAX_VALUE;
    var maxNX = Number.MIN_VALUE;
    var maxNY = Number.MIN_VALUE;

    this._nodes.forEach(function (node) {
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
    this._edges.forEach(function (edge) {
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
    this._nodes = this._nodes.concat(graph.nodes);
    this._edges = this._edges.concat(graph.edges);

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
        node.setNodeAccept(true);
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
      const formattedEdge = this.formatEdge(edge);
      if (edge != formattedEdge) this.deleteEdge(edge);
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
    this._dirty = true;
    for(const callback of this._callbacks)
    {
      callback(this);
    }
    this._dirty = false;
  }
}
//Mixin Eventable
Eventable.mixin(NodalGraph);

export default NodalGraph;
