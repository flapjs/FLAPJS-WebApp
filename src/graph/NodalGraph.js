import Eventable from 'util/Eventable.js';
import Config from 'config.js';

import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';

import Node from './Node.js';
import Edge from './Edge.js';
import { EMPTY } from 'machine/Symbols.js';
//nodeCreate(node) - Whenever a new node is created
//nodeDestroy(node) - Whenever a node is destroyed (even on clear)
//nodeLabel(node, newLabel, oldLabel) - Whenever a node label changes
//nodeCustomLabel(node, newLabel, oldLabel) - Whenever a node custom label changes
//edgeCreate(edge) - Whenever a new edge is created
//edgeDestroy(edge) - Whenever an edge is destroyed (even on clear)
//edgeLabel(edge, newLabel, oldLabel) - Whenever a node label changes
//edgeDestination(edge, newDestination, oldDestination) - Whenever a node changes destination
//toggleAccept(node) - Whenever a node changes to an accept state, or vice versa
//newInitial(node, oldNode) - Whenever a node becomes the initial state; oldNode could be null
//markDirty(graph) - Whenever the graph is marked dirty
class NodalGraph
{
  constructor(nodes=[], edges=[])
  {
    this.nodes = nodes;
    this.edges = edges;

    this.shouldUseQuadCoords = true;
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

  newEdge(from, to, label)
  {
    const result = new Edge(this, from, to, label);
    this.edges.push(result);
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

    this.markDirty();
  }

  markDirty()
  {
    this.emit("markDirty", this);
  }

  static parseJSON(data)
  {
    const nodeLength = data.nodeCount;
    const edgeLength = data.edgeCount;

    if (nodeLength < 0) throw new Error("Invalid graph data: negative number of nodes.");
    if (edgeLength < 0) throw new Error("Invalid graph data: negative number of edges.");

    const dst = new NodalGraph(new Array(nodeLength), new Array(edgeLength));
    dst.shouldUseQuadCoords = data.shouldUseQuadCoords || false;

    //The initial node is always saved/loaded first!
    for(let i = 0; i < nodeLength; ++i)
    {
      const node = data.nodes[i];
      const newNode = new Node(dst, node.x || 0, node.y || 0, node.label || "q?");
      newNode.accept = node.accept;
      if (node.customLabel)
      {
        newNode.setCustomLabel(newNode.label);
      }
      dst.nodes[i] = newNode;
    }

    for(let i = 0; i < edgeLength; ++i)
    {
      const edge = data.edges[i];

      if (edge.from >= nodeLength || edge.from < 0) throw new Error("Invalid edge from data: node index \'" + edge.from + "\' out of bounds.");

      const newEdge = new Edge(dst, dst.nodes[edge.from], edge.to < 0 ? null : dst.nodes[edge.to], edge.label || "0");

      //Force copy all quadratic data
      newEdge.copyQuadraticsFrom(edge.quad);
      dst.edges[i] = newEdge;
    }

    return dst;
  }

  static parseXML(data)
  {
    let nodeList = data.getElementsByTagName("state");
    let edgeList = data.getElementsByTagName("transition");
    const nodeLength = nodeList.length;
    const edgeLength = edgeList.length;

    if (nodeLength < 0) throw new Error("Invalid graph data: negative number of nodes.");
    if (edgeLength < 0) throw new Error("Invalid graph data: negative number of edges.");

    const dst = new NodalGraph(new Array(nodeLength), new Array(edgeLength));
    let nodeIDMap = new Map();
    let startNodeID;
    //create nodes list
    for(let i = 0; i < nodeLength; ++i)
    {
      let node = nodeList[i];
      let nodeLabel = node.attributes[1].nodeValue;
      let nodeID = node.attributes[0].nodeValue;
      let nodeX = node.childNodes[1].childNodes[0].nodeValue;
      let nodeY = node.childNodes[3].childNodes[0].nodeValue;
      let nodeAccept = node.getElementsByTagName("final").length;
      let nodeStart = node.getElementsByTagName("initial").length;
      if(nodeStart) startNodeID = nodeID;//TODO: allow JFLAP names to be id
      let newNode = new Node(dst, nodeX , nodeY , Config.STR_STATE_LABEL + (nodeID));
      newNode.accept = nodeAccept;
      if(nodeStart)
      {
        if(dst.nodes[0])
        {
          dst.nodes[i] = dst.nodes[0];
          nodeIDMap.set(nodeList[0].attributes[0].nodeValue, i);
          dst.nodes[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
        else
        {
          dst.nodes[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
      }
      dst.nodes[i] = newNode;
      nodeIDMap.set(nodeID, i);
    }
    const boundingRect = dst.getBoundingRect();
    const width = boundingRect.width;
    const height = boundingRect.height;
    for(var i = 0; i < dst.nodes.length; i++)
    {
      dst.nodes[i].x -= width/2;
      dst.nodes[i].y -= height/2;
    }

    //create edge lists
    for(let i = 0; i < edgeLength; ++i)
    {
      const edge = edgeList[i];
      const edgeFrom = edge.childNodes[1].childNodes[0].nodeValue;
      const edgeTo = edge.childNodes[3].childNodes[0].nodeValue;
      let edgeLabel = edge.childNodes[5];
      if(edgeLabel.childNodes[0]) edgeLabel = edgeLabel.childNodes[0].nodeValue;
      else edgeLabel = EMPTY;
      const indexOfEdgeFrom = nodeIDMap.get(edgeFrom);
      const indexOfEdgeTo = nodeIDMap.get(edgeTo);

      //check valid from and to node
      if(dst.nodes[indexOfEdgeFrom] || (startNodeID == edgeFrom && dst.nodes[0]) || (edgeFrom == 0 && dst.nodes[startNodeID]) )
      {
        const newEdge = new Edge(dst, dst.nodes[indexOfEdgeFrom], edgeTo < 0 ? null : dst.nodes[indexOfEdgeTo], edgeLabel || "0");
        dst.edges[i] = newEdge;
        if (edgeFrom == edgeTo)
        {
          newEdge.makeSelfLoop(Math.PI / 2);
        }
      }
      else
      {
         throw new Error("Invalid edge from data: node index \'" + edge.from + "\' out of bounds.");
      }
    }
    return dst;
  }

  toJSON()
  {
    const nodeLength = this.nodes.length;
    const edgeLength = this.edges.length;

    const data = {
      nodeCount: nodeLength,
      nodes: new Array(nodeLength),
      edgeCount: edgeLength,
      edges: new Array(edgeLength),
      shouldUseQuadCoords: this.shouldUseQuadCoords
    };

    for(let i = 0; i < nodeLength; ++i)
    {
      const node = this.nodes[i];
      data.nodes[i] = {
        x: node.x,
        y: node.y,
        label: node.label,
        accept: node.accept,
        customLabel: node.hasCustomLabel()
      };
    }

    for(let i = 0; i < edgeLength; ++i)
    {
      const edge = this.edges[i];
      data.edges[i] = {
        from: this.nodes.indexOf(edge.from),
        to: this.nodes.indexOf(edge.to),
        quad: edge.copyQuadraticsTo({}),
        label: edge.label
      };
    }

    return data;
  }

  toDFA(dst=null)
  {
    const result = dst || new DFA();
    if (!(result instanceof DFA))
      throw new Error("Trying to parse graph mismatched machine type.");
    fillFSA(this, result);
    return result;
  }

  toNFA(dst=null)
  {
    console.error("RAWR! I am a T-Rex!");
    return this._toNFA(dst);
  }

  //TODO: NEVER CALL THIS DIRECTLY (Only FSABuilder is allowed.) Will be deprecated later.
  _toNFA(dst=null)
  {
    const result = dst || new NFA();
    if (!(result instanceof NFA))
      throw new Error("Trying to parse graph mismatched machine type.");
    fillFSA(this, result);
    return result;
  }
}
//Mixin Eventable
Eventable.mixin(NodalGraph);

function fillFSA(graph, fsa)
{
  if (graph.nodes.length <= 0) return fsa;
  //Create all the nodes
  for(const node of graph.nodes)
  {
    try
    {
      let state = node.label;
      fsa.newState(state);

      //Set final state
      if (node.accept)
      {
        fsa.setFinalState(state, true);
      }
    }
    catch(e)
    {
      throw e;
    }
  }

  //Create all the edges
  for(const edge of graph.edges)
  {
    //Ignore any incomplete edges
    if (edge.isPlaceholder()) continue;
    const from = edge.from;
    const to = edge.to;
    if (from instanceof Node && to instanceof Node)
    {
      const labels = edge.label.split(",");
      for(const label of labels)
      {
        try
        {
          fsa.newTransition(from.label, to.label, label);
        }
        catch(e)
        {
          throw e;
        }
      }
    }
  }

  //Set start state
  let startState = graph.getStartNode().label;
  fsa.setStartState(startState);

  return fsa;
}

function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}

export default NodalGraph;
