import Config from 'config.js';

import NodalGraph from './NodalGraph.js';
import Node from 'modules/newfsa/graph/FSANode.js';
import Edge from 'modules/newfsa/graph/FSAEdge.js';
import { guid } from 'util/MathHelper.js';

import { CURRENT_VERSION_STRING } from 'util/FlapSaver.js';

const EDGE_SYMBOL_SEPARATOR = Config.EDGE_SYMBOL_SEPARATOR;

class NodalGraphParser
{
  static parseJSON(data, dst=null)
  {
    const nodeLength = data.nodeCount;
    const edgeLength = data.edgeCount;

    if (nodeLength < 0) throw new Error("Invalid graph data: negative number of nodes.");
    if (edgeLength < 0) throw new Error("Invalid graph data: negative number of edges.");

    if (dst) dst.clear();
    const result = dst || new NodalGraph(new Array(nodeLength), new Array(edgeLength));

    //The initial node is always saved/loaded first!
    for(let i = 0; i < nodeLength; ++i)
    {
      const nodeData = data.nodes[i];
      const newNode = new Node(nodeData.id, nodeData.x || 0, nodeData.y || 0);
      newNode.setNodeLabel(nodeData.label || "q?");
      newNode.setNodeAccept(nodeData.accept);
      newNode.setNodeCustom(nodeData.customLabel);
      result.getNodes()[i] = newNode;
    }

    for(let i = 0; i < edgeLength; ++i)
    {
      const edgeData = data.edges[i];

      if (edgeData.from >= nodeLength || edgeData.from < 0) throw new Error("Invalid edge from data: node index \'" + edgeData.from + "\' out of bounds.");

      const newEdge = new Edge(edgeData.id, result.getNodes()[edgeData.from], edgeData.to < 0 ? null : result.getNodes()[edgeData.to]);
      newEdge.setEdgeLabel(edgeData.label || "0");

      //Force copy all quadratic data
      newEdge.setQuadratic(edgeData.quad.radians, edgeData.quad.length);
      result.getEdges()[i] = newEdge;
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

    if (dst) dst.clear();
    //HACK: call newEdge to auto layout the graph, therefore a fixed length array cannot be allocated.
    const result = dst || new NodalGraph(new Array(nodeLength));
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
      let newNode = new Node(guid(), nodeX || 0, nodeY || 0);
      newNode.setNodeLabel(Config.STR_STATE_LABEL + (nodeID));
      newNode.setNodeAccept(nodeAccept != null && nodeAccept.length > 0);
      if(nodeStart && nodeStart.length > 0)
      {
        if(result.getNodes()[0])
        {
          result.getNodes()[i] = result.getNodes()[0];
          nodeIDMap.set(nodeList[0].attributes[0].nodeValue, i);
          result.getNodes()[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
        else
        {
          result.getNodes()[0] = newNode;
          nodeIDMap.set(nodeID, 0);
        }
      }
      result.getNodes()[i] = newNode;
      nodeIDMap.set(nodeID, i);
    }
    const boundingRect = result.getBoundingRect();
    const width = boundingRect.width;
    const height = boundingRect.height;
    for(var i = 0; i < result.getNodes().length; i++)
    {
      result.getNodes()[i].x -= boundingRect.minX + width / 2;
      result.getNodes()[i].y -= boundingRect.minY + height / 2;
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
      if(result.getNodes()[indexOfEdgeFrom] || (startNodeID == edgeFrom && result.getNodes()[0]) || (edgeFrom == 0 && result.getNodes()[startNodeID]) )
      {
        const newEdge = result.newEdge(result.getNodes()[indexOfEdgeFrom], edgeTo < 0 ? null : result.getNodes()[indexOfEdgeTo], edgeLabel || "0");
        const formattedEdge = result.formatEdge(newEdge);
        if (newEdge != formattedEdge) result.deleteEdge(newEdge);
      }
      else
      {
         throw new Error("Invalid edge from data: node index \'" + edge.from + "\' out of bounds.");
      }
    }
    return result;
  }

  static toJSON(graph)
  {
    const nodeLength = graph.getNodes().length;
    const edgeLength = graph.getEdges().length;

    const data = {
      nodeCount: nodeLength,
      nodes: new Array(nodeLength),
      edgeCount: edgeLength,
      edges: new Array(edgeLength)
    };

    for(let i = 0; i < nodeLength; ++i)
    {
      const node = graph.getNodes()[i];
      data.nodes[i] = {
        id: node.getGraphElementID(),
        x: node.x,
        y: node.y,
        label: node.getNodeLabel(),
        accept: node.getNodeAccept(),
        customLabel: node.getNodeCustom()
      };
    }

    for(let i = 0; i < edgeLength; ++i)
    {
      const edge = graph.getEdges()[i];
      const edgeQuad = edge.getQuadratic();
      data.edges[i] = {
        id: edge.getGraphElementID(),
        from: graph.getNodes().indexOf(edge.getSourceNode()),
        to: graph.getNodes().indexOf(edge.getDestinationNode()),
        quad: { radians: edgeQuad.radians, length: edgeQuad.length },
        label: edge.getEdgeLabel()
      };
    }

    return data;
  }

  static toXML(graph)
  {
    const header = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!--Created with flap.js " + CURRENT_VERSION_STRING + "--><structure></structure>";
    let parser = new DOMParser();
    const doc = parser.parseFromString(header, "application/xml");

    const structure = doc.getElementsByTagName("structure")[0];

    const type = doc.createElement("type");
    type.innerHTML = "fa";//For FSA
    structure.appendChild(type);

    const automaton = doc.createElement("automaton");
    structure.appendChild(automaton);

    let node, state, x, y;
    for(let i = 0; i < graph.getNodes().length; ++i)
    {
      node = graph.getNodes()[i];

      //state tag
      state = doc.createElement("state");
      state.id = "" + i;
      state.setAttribute("name", node.getNodeLabel());
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
      if (node.getNodeAccept())
      {
        state.appendChild(doc.createElement("final"));
      }
    }

    let transition, from, to, read, symbols;
    for(let edge of graph.getEdges())
    {
      symbols = edge.getEdgeLabel().split(EDGE_SYMBOL_SEPARATOR);
      for(let symbol of symbols)
      {
        //transition tag
        transition = doc.createElement("transition");
        automaton.appendChild(transition);

        //from tag
        from = doc.createElement("from");
        from.innerHTML = graph.getNodes().indexOf(edge.getSourceNode());
        transition.appendChild(from);

        //to tag
        to = doc.createElement("to");
        to.innerHTML = graph.getNodes().indexOf(edge.getDestinationNode());
        transition.appendChild(to);

        //read tag
        read = doc.createElement("read");
        read.innerHTML = symbol;
        transition.appendChild(read);
      }
    }

    return doc;
  }
}

export default NodalGraphParser;
