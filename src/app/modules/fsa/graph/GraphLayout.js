
/**
 * This function split the nodes in graph to reachable nodes and unreachable nodes
 */
function splitReachableState(graph)
{
  let reachable = [];
  let startNode = graph.getStartNode();
  reachable.push(startNode);
  //get all reachable nodes
  for(let i = 0; i < reachable.length; i++)
  {
    for (const edge of graph.getEdges())
    {
      if(edge._from == reachable[i])
      {
        if(!reachable.includes(edge._to))
        {
          reachable.push(edge._to);
        }
      }
    }
  }
  //function to filter the unreachable nodes
  function unreachableNode(node)
  {
    return !reachable.includes(node)
  }
  const unreachable = graph.getNodes().filter(unreachableNode)
  return [reachable,unreachable];
}

/**
 * This function takes in a graph and return 2 maps. One is the incoming edges
 * for each node in the graph and another one is outcoming edges for each node
 * in the graph
 */
function getEdgesMaps(graph)
{
  let incomingEdges = new Map();
  let outgoingEdges = new Map();
  for (const edge of graph.getEdges())
  {
    const fromNode = edge._from;
    const toNode   = edge._to;
    if(incomingEdges.has(toNode))
    {
      let currentList = incomingEdges.get(toNode);
      currentList.push(fromNode);
      incomingEdges.set(toNode,currentList);
    }
    else
    {
      incomingEdges.set(toNode, [fromNode]);
    }

    if(outgoingEdges.has(fromNode))
    {
      let currentList = outgoingEdges.get(fromNode);
      currentList.push(toNode);
      outgoingEdges.set(fromNode,currentList);
    }
    else
    {
      outgoingEdges.set(fromNode, [toNode]);
    }
  }

  return [incomingEdges, outgoingEdges];
}

/**
 * This function takes in a graph and return a map of sorted nodes
 * In the returned map, the key is nodes which has at least one outgoing edges
 * and the value for corresponding key is key's children and but not all of the children
 */
function topologicalSort(graph)
{
  let sortedNodes = new Map();
  let levelMap = new Map();
  let nodesList = Array.from(graph.getNodes());
  const startNode = graph.getStartNode();
  let maps = getEdgesMaps(graph);
  let incomingEdges = maps[0];
  let outgoingEdges = maps[1];
  let sourceNodes = [];
  let maxLevel = 1;
  levelMap.set(startNode, 0)
  sourceNodes.push(startNode);
  //check if there is incoming edges to the start nodes
  if (incomingEdges.has(startNode))
  {
    throw new Error("Graph is not DAG")
    return null;
  }
  while(sourceNodes.length != 0)
  {
    const currentNode = sourceNodes.pop();
    nodesList.splice(nodesList.indexOf(currentNode),1)
    const currentLevel = levelMap.get(currentNode)
    if(outgoingEdges.has(currentNode))
    {
      for(const node of outgoingEdges.get(currentNode))
      {
        let currentList =  incomingEdges.get(node);
        currentList.splice(currentList.indexOf(currentNode),1);
        if(currentList.length == 0)
        {
          sourceNodes.push(node);
          levelMap.set(node,currentLevel+1)
          if (currentLevel+1 > maxLevel) maxLevel = currentLevel+1
          if (sortedNodes.has(currentNode))
          {
            let temp = sortedNodes.get(currentNode)
            temp.push(node)
            sortedNodes.set(currentNode, temp);
          }
          else
          {
            sortedNodes.set(currentNode, [node]);
          }
        }
        incomingEdges.set(node, currentList);
      }
    }
  }
  if (nodesList.length != 0)
  {
    const result= splitReachableState(graph);
    const unreachableNode = result[1];
    for (const node of nodesList)
    {
      if(!unreachableNode.includes(node))
      {
        throw new Error("Graph is not DAG")
        return null;
      }
    }
  }
  return [sortedNodes,maxLevel,levelMap];
}

class GraphLayout
{
  static applyLayout(graph, type="circle")
  {
    if (type != "circle") throw new Error("Invalid layout type");
    //seperate node to reachable and unreachable
    const res= splitReachableState(graph);
    const reachableNode = res[0];
    const unreachableNode = res[1];
    //get num of nodes
    const numOfReachable = reachableNode.length;
    const numOfUnreachable = unreachableNode.length;
    const numOfNode = graph.getNodes().length;
    const maxNum = Math.max(numOfReachable, numOfUnreachable)
    if(numOfNode == 0)
    {
      return;
    }
    //set radius
    var radius;
    if(numOfReachable < 10 && numOfUnreachable < 10){
      radius = maxNum/4 * 50 + 30;
    }
    else{
      radius = (maxNum/5) * 40 + 30;
    }

    let currentStep = 0
    if (numOfReachable == 1)
    {
      let degree = 2* Math.PI/numOfNode
      for(const node of graph.getNodes())
      {
        node.y = Math.sin(degree*currentStep + Math.PI)*radius;
        node.x = Math.cos(degree*currentStep + Math.PI)*radius;
        currentStep += 1
      }
    }
    else {
      const degree_re = 2* Math.PI/numOfReachable;
      const degree_un = 2* Math.PI/numOfUnreachable;

      currentStep = 0
      for(const node of reachableNode)
      {
        node.y = Math.sin(degree_re*currentStep + Math.PI)*radius;
        node.x = Math.cos(degree_re*currentStep + Math.PI)*radius;
        currentStep += 1
      }
      currentStep = 0
      for(const node of unreachableNode)
      {
        node.y = Math.sin(degree_un*currentStep + Math.PI)*(radius + 100);
        node.x = Math.cos(degree_un*currentStep + Math.PI)*(radius + 100);
        currentStep += 1
      }
    }
    /*for(const node of graph.getNodes())
    {
      node.y = Math.sin(degree*currentStep + Math.PI)*radius;
      node.x = Math.cos(degree*currentStep + Math.PI)*radius;
      currentStep += 1
    }*/
  }

/**
 * 1. Check if the graph is dag
 * 2. Apply topological sort
 * 3. According to sorted nodes, check for nearest connection of it with previous nodes
 */
  static applyLinearization(graph, type="linearization")
  {
    const result= splitReachableState(graph);
    let nodesList = Array.from(graph.getNodes());
    const unreachableNode = result[1];
    const res = topologicalSort(graph);
    const sortedNodes = res[0];
    const maxLevel   = res[1];
    const levelMap   = res[2];
    const startNode = graph.getStartNode();
    //TODO:better if can get width of canvas
    const horizontalDis = 150
    let currentNode = startNode;
    let currentx = -1* maxLevel/2;
    currentNode.x = currentx * horizontalDis;
    currentNode.y = 0
    for (const node of sortedNodes.keys())
    {
      const parentx = node.x;
      const parenty = node.y;
      const childrenList = sortedNodes.get(node);
      const numOfChildren = childrenList.length;
      //the degree of split for children's node
      const degree = Math.PI/(numOfChildren + 1);
      let i = 1;
      for (const children of childrenList)
      {
        if (nodesList.includes(children))
        {
          nodesList.splice(nodesList.indexOf(children),1);
          children.x = parentx + Math.sin(degree*i) * horizontalDis;
          children.y = parenty - Math.cos(degree*i) * horizontalDis;
          i = i+1;
        }
      }
    }
    let j = 0
    if (unreachableNode.length != 0)
    {
      for(const node of unreachableNode)
      {
        node.y = horizontalDis + 100
        node.x = 50 * j;
        j = j+1;
      }
    }


  }

}

export default GraphLayout;
