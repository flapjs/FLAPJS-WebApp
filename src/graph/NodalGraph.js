import Eventable from 'util/Eventable.js';

import { NODE_RADIUS, SELF_LOOP_HEIGHT, PLACEHOLDER_LENGTH } from 'config.js';

import Node from './Node.js';
import Edge from './Edge.js';

//nodeCreate(node) - Whenever a new node is created
//nodeDestroy(node) - Whenever a node is destroyed (even on clear)
//nodeLabel(node, newLabel, oldLabel) - Whenever a node label changes
//edgeCreate(edge) - Whenever a new edge is created
//edgeDestroy(edge) - Whenever an edge is destroyed (even on clear)
//edgeLabel(edge, newLabel, oldLabel) - Whenever a node label changes
//edgeDestination(edge, newDestination, oldDestination) - Whenever a node changes destination
//toggleAccept(node) - Whenever a node changes to an accept state, or vice versa
//newInitial(node, oldNode) - Whenever a node becomes the initial state; oldNode could be null
class NodalGraph
{
  constructor()
  {
    this.nodes = [];
    this.edges = [];
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
  }

  newEdge(from, to, label)
  {
    const result = new Edge(this, from, to, label);
    this.edges.push(result);
    this.emit("edgeCreate", result);
    return result;
  }

  deleteEdge(edge)
  {
    this.edges.splice(this.edges.indexOf(edge), 1);
    this.emit("edgeDestroy", edge);
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
  }

  setStartNode(node)
  {
    if (this.nodes.length <= 1) return;

    this.nodes.splice(this.nodes.indexOf(node), 1);
    const prevNode = this.nodes[0];
    this.nodes.unshift(node);
    this.emit("newInitial", node, prevNode);
  }

  getStartNode()
  {
    return this.nodes.length > 0 ? this.nodes[0] : null;
  }
}
//Mixin Eventable
Object.assign(NodalGraph.prototype, Eventable);

function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}

export default NodalGraph;
