class GraphLayout
{
  static applyLayout(graph, type="circle")
  {
    if (type != "circle") throw new Error("Invalid layout type");
    //seperate node to reachable and unreachable
    const reachableNode= graph.getReachableState()
    function unreachable(node)
    {
      return !reachableNode.includes(node)
    }
    const unreachableNode = graph.nodes.filter(unreachable)

    //get num of nodes
    const numOfReachable = reachableNode.length;
    const numOfUnreachable = unreachableNode.length;
    const numOfNode = graph.nodes.length;
    const maxNum = Math.max(numOfReachable, numOfUnreachable)
    //set radius
    var radius;
    if(numOfReachable < 10 && numOfUnreachable < 10){
      radius = maxNum/4 * 50 + 10;
    }
    else{
      radius = (maxNum/5) * 40 + 10;
    }
    /*var radius;
    if(numOfNode < 10){
      radius = numOfNode/4 * 50 + 10;
    }
    else{
      radius = (numOfNode/5) * 40 + 10;
    }*/

    //set degree
    const degree_re = 2* Math.PI/numOfReachable;
    const degree_un = 2* Math.PI/numOfUnreachable;

    let currentStep = 0
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
    /*for(const node of graph.nodes)
    {
      node.y = Math.sin(degree*currentStep + Math.PI)*radius;
      node.x = Math.cos(degree*currentStep + Math.PI)*radius;
      currentStep += 1
    }*/
  }


}

export default GraphLayout;
