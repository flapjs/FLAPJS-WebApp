import Config from 'config.js';
import Eventable from 'util/Eventable.js';

import GraphLayout from 'graph/GraphLayout.js';

import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';

import Node from './Node.js';
import Edge from './Edge.js';
import { EMPTY } from 'machine/Symbols.js';

class NodalGraph
{
  constructor(nodes=[], edges=[])
  {
    this.nodes = nodes;
    this.edges = edges;

    this.shouldUseQuadCoords = false;

    this._version = 0;

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
        result.setQuadVector(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
        edge.setQuadVector(HALFPI, Config.PARALLEL_EDGE_HEIGHT);
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

  static parseJSON(data, dst=null)
  {
    const nodeLength = data.nodeCount;
    const edgeLength = data.edgeCount;

    if (nodeLength < 0) throw new Error("Invalid graph data: negative number of nodes.");
    if (edgeLength < 0) throw new Error("Invalid graph data: negative number of edges.");

    if (dst) dst.deleteAll();
    const result = dst || new NodalGraph(new Array(nodeLength), new Array(edgeLength));
    result.shouldUseQuadCoords = data.shouldUseQuadCoords || false;

    //The initial node is always saved/loaded first!
    for(let i = 0; i < nodeLength; ++i)
    {
      const node = data.nodes[i];
      const newNode = new Node(result, node.x || 0, node.y || 0, node.label || "q?");
      newNode.accept = node.accept;
      if (node.customLabel)
      {
        newNode.setCustomLabel(newNode.label);
      }
      result.nodes[i] = newNode;
    }

    for(let i = 0; i < edgeLength; ++i)
    {
      const edge = data.edges[i];

      if (edge.from >= nodeLength || edge.from < 0) throw new Error("Invalid edge from data: node index \'" + edge.from + "\' out of bounds.");

      const newEdge = new Edge(result, result.nodes[edge.from], edge.to < 0 ? null : result.nodes[edge.to], edge.label || "0");

      //Force copy all quadratic data
      newEdge.copyQuadraticsFrom(edge.quad);
      result.edges[i] = newEdge;
    }

    return result;
  }

  static parseXML(data, dst=null)
  {
    let nodeList = data.getElementsByTagName("state");
    let edgeList = data.getElementsByTagName("transition");
    const nodeLength = nodeList.length;
    const edgeLength = edgeList.length;

    if (nodeLength < 0) throw new Error("Invalid graph data: negative number of nodes.");
    if (edgeLength < 0) throw new Error("Invalid graph data: negative number of edges.");

    if (dst) dst.deleteAll();
    //HACK: call newEdge to auto layout the graph, therefore a fixed length array cannot be allocated.
    const result = dst || new NodalGraph(new Array(nodeLength), []);
    let nodeIDMap = new Map();
    let startNodeID;
    //create nodes list
    for(let i = 0; i < nodeLength; ++i)
    {
      let node = nodeList[i];
      let nodeLabel = node.attributes[1].nodeValue;
      let nodeID = node.attributes[0].nodeValue;
      let nodeX = parseFloat(node.childNodes[1].childNodes[0].nodeValue);
      let nodeY = parseFloat(node.childNodes[3].childNodes[0].nodeValue);
      let nodeAccept = node.getElementsByTagName("final");
      let nodeStart = node.getElementsByTagName("initial");
      if(nodeStart && nodeStart.length > 0) startNodeID = nodeID;//TODO: allow JFLAP names to be id
      let newNode = new Node(result, nodeX , nodeY , Config.STR_STATE_LABEL + (nodeID));
      newNode.accept = (nodeAccept != null && nodeAccept.length > 0);
      if(nodeStart && nodeStart.length > 0)
      {
        if(result.nodes[0])
        {
          result.nodes[i] = result.nodes[0];
          nodeIDMap.set(nodeList[0].attributes[0].nodeValue, i);
          result.nodes[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
        else
        {
          result.nodes[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
      }
      result.nodes[i] = newNode;
      nodeIDMap.set(nodeID, i);
    }
    const boundingRect = result.getBoundingRect();
    const width = boundingRect.width;
    const height = boundingRect.height;
    for(var i = 0; i < result.nodes.length; i++)
    {
      result.nodes[i].x -= boundingRect.minX + width / 2;
      result.nodes[i].y -= boundingRect.minY + height / 2;
      //result.nodes[i].x = parseFloat(result.nodes[i].x) + width/2;
      //result.nodes[i].y = -height/2 - parseFloat(result.nodes[i].y);
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
      if(result.nodes[indexOfEdgeFrom] || (startNodeID == edgeFrom && result.nodes[0]) || (edgeFrom == 0 && result.nodes[startNodeID]) )
      {
        result.newEdge(result.nodes[indexOfEdgeFrom], edgeTo < 0 ? null : result.nodes[indexOfEdgeTo], edgeLabel || "0");
      }
      else
      {
         throw new Error("Invalid edge from data: node index \'" + edge.from + "\' out of bounds.");
      }
    }
    return result;
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

  toXML()
  {
    const header = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!--Created with flap.js 1.0.0.--><structure></structure>";
    let parser = new DOMParser();
    const doc = parser.parseFromString(header, "application/xml");

    const structure = doc.getElementsByTagName("structure")[0];

    const type = doc.createElement("type");
    type.innerHTML = "fa";//For FSA
    structure.appendChild(type);

    const automaton = doc.createElement("automaton");
    structure.appendChild(automaton);

    let node, state, x, y;
    for(let i = 0; i < this.nodes.length; ++i)
    {
      node = this.nodes[i];

      //state tag
      state = doc.createElement("state");
      state.id = "" + i;
      state.setAttribute("name", node.label);
      automaton.appendChild(state);

      //x tag
      x = doc.createElement("x");
      x.innerHTML = node.x;
      state.appendChild(x);

      //y tag
      y = doc.createElement("y");
      y.innerHTML = node.y;
      state.appendChild(y);

      //initial tag
      if (i == 0)
      {
        state.appendChild(doc.createElement("initial"));
      }

      //final tag
      if (node.accept)
      {
        state.appendChild(doc.createElement("final"));
      }
    }

    let transition, from, to, read, symbols;
    for(let edge of this.edges)
    {
      symbols = edge.label.split(",");
      for(let symbol of symbols)
      {
        //transition tag
        transition = doc.createElement("transition");
        automaton.appendChild(transition);

        //from tag
        from = doc.createElement("from");
        from.innerHTML = this.nodes.indexOf(edge.from);
        transition.appendChild(from);

        //to tag
        to = doc.createElement("to");
        to.innerHTML = this.nodes.indexOf(edge.to);
        transition.appendChild(to);

        //read tag
        read = doc.createElement("read");
        read.innerHTML = symbol;
        transition.appendChild(read);
      }
    }

    return doc;
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
