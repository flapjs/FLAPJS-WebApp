class GraphLayout
{
  static applyLayout(graph, type="circle")
  {
    if (type != "circle") throw new Error("Invalid layout type");

    //handle for too much nodes case
    const numOfNode = graph.nodes.length;
    const radius = (numOfNode/5) * 40 + 10;
    const degree = 2* Math.PI/numOfNode;
    let currentStep = 0;
    for(let i = 0; i < numOfNode; i++)
    {
      graph.nodes[i].y = Math.sin(degree*currentStep + Math.PI)*radius;
      graph.nodes[i].x = Math.cos(degree*currentStep + Math.PI)*radius;
      currentStep += 1;
    }
  }
}

export default GraphLayout;
