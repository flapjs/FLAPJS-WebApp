class AutoLayout
{
  constructor()
  {
    this.layoutType = "circle";
  }

  applyLayout(graph)
  {
    //handle for too much nodes case
    const numOfNode = graph.nodes.length;
    const radius = (numOfNode/5) * 40 + 10;
    const degree = 2*3.14/numOfNode;
    let currentStep = 0;
    for(let i = graph.nodes.length - 1; i >= 0; i--)
    {
      graph.nodes[i].x = Math.sin(degree*currentStep)*radius;
      graph.nodes[i].y = Math.cos(degree*currentStep)*radius;
      currentStep += 1;
    }
  }
}
export default new AutoLayout();
