class InputController
{
  //Interpret user intent from input
  // - GraphController
  // - MachineController

  onActionEvent()
  {
    this.graphController.createNode();
  }
}

class GraphController
{
  //Used by InputController to apply intent to graph
  // - DFAGraph (Node, Edge)
  // - Rendered by workspace
  // - CreateNodeByUser() -> CreateNodeByMachine + other logic
  createNode()
  {
    this.graph.newNode();
  }
}

class MachineController
{
  //Batch logic for analysis/testing/etc.
  // - DFADefinition (States, Transitions, etc.)
  // - Rendered by panel
  // * Can create nodes / edges through DFAGraph?
  //    - these would be without user intent, but rather batch logic
  createState()
  {
    this.graph.newNode();
    //And any additional logic to maintain machine validity
    //Such as adding all remaining transitions
  }
}

class GraphValidator
{
  //Used by MachineController to validate graph for definition
  // - DFAGraph -> DFADefinition
}

class GraphRenderer
{
  //Renders the graph
  // - DFAGraph

  renderNode(node)
  {

  }

  renderEdge(edge)
  {

  }

  render()
  {
    //Render all components
  }
}

class Graph
{
  //CreateNodeByMachine()
  newNode()
  {

  }

  deleteNode()
  {

  }

  getNodeByID()
  {

  }

  newEdge()
  {

  }

  deleteEdge()
  {

  }

  getEdgeByID()
  {

  }

  getNodes()
  {

  }

  getEdges()
  {

  }

  getBoundingRect()
  {

  }
}

class GraphHandler
{
  onGraphCreateNode(x, y)
  {

  }

  onGraphDestroyNode(node)
  {
    return true;
  }

  onGraphCreateEdge(from, to)
  {

  }

  onGraphDestroyEdge(edge)
  {
    return true;
  }
}

class Graph
{
  constructor(handler)
  {
    this.handler = handler;

    //Set of nodes
    this.nodes = [];

    //Set of edges
    this.edges = [];
  }

  getNodeByID(id)
  {
    for(let node of this.nodes)
    {
      if (node.id == id)
      {
        return node;
      }
    }

    return null;
  }

  newNode(x=0, y=0)
  {
    const result = this.handler.onGraphCreateNode(x, y);
    if (result instanceof Node)
    {
      this.nodes.push(result);
      return result;
    }
    return null;
  }

  deleteNode(node)
  {
    const result = this.handler.onGraphDestroyNode(node);
    //Delete any edges that has this node as a source...

    //Then...
    return node;
  }

  getEdgeByID(id)
  {
    for(let edge of this.edges)
    {
      if (edge.id == id)
      {
        return edge;
      }
    }

    return null;
  }

  newEdge(from, to=null)
  {
    const result = this.handler.onGraphCreateEdge(from, to);
    if (result instanceof Edge)
    {
      //Format the edges correctly...

      //Then...
      this.edges.push(result);
      return result;
    }
    return null;
  }

  deleteEdge(edge)
  {
    const result = this.handler.onGraphDestroyEdge(edge);
    return result;
  }

  getBoundingRect()
  {

  }
}

function getNodeByLabel(graph, label) {}
function getNodeIndexByID(graph, label) {}
function getNodeIndex(graph, label) {}
function getNodeIndexByLabel(graph, label) {}


/*
class DFAModule
{
  constructor()
  {
    //Unique Start state
    //Toggleable Accept state
    //Comman separated formatter

    //Set of Alphabet
    //Error Checker
    //Testing panel
    //Analysis panel
  }
}

class NFAModule
{
  constructor()
  {
  }
}

class PDAModule
{
  constructor()
  {
    //Unique start state
    //Toggleable Accept state
    //Pair and arrow label formatter

    //Set of Alphabet
    //Set of pushdown symbols
    //Error Checker
    //Testing panel
    //Analysis panel
  }
}

class TMModule
{
  constructor()
  {
    //Unique start state
    //Unique accept state
    //Unique reject state
    //2 Pair and arrow label formatter

    //Set of Alphabet
    //Set of pushdown symbols
    //Error Checker
    //Testing panel
    //Analysis panel
  }
}
*/
