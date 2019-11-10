
function getReachableState(graph)
{
    let reachable = [];
    let startNode = graph.getStartNode();
    reachable.push(startNode);
    for (let i = 0; i < reachable.length; i++)
    {
        for (const edge of graph.getEdges())
        {
            if (edge._from == reachable[i])
            {
                if (!reachable.includes(edge._to))
                {
                    reachable.push(edge._to);
                }
            }
        }
    }
    return reachable;
}

class GraphLayout
{
    static applyLayout(graph, type = 'circle')
    {
        if (type != 'circle') throw new Error('Invalid layout type');
        //seperate node to reachable and unreachable
        const reachableNode = getReachableState(graph);
        function unreachable(node)
        {
            return !reachableNode.includes(node);
        }
        const unreachableNode = graph.getNodes().filter(unreachable);

        //get num of nodes
        const numOfReachable = reachableNode.length;
        const numOfUnreachable = unreachableNode.length;
        const numOfNode = graph.getNodes().length;
        const maxNum = Math.max(numOfReachable, numOfUnreachable);
        if (numOfNode == 0)
        {
            return;
        }
        //set radius
        var radius;
        if (numOfReachable < 10 && numOfUnreachable < 10)
        {
            radius = maxNum / 4 * 50 + 30;
        }
        else
        {
            radius = (maxNum / 5) * 40 + 30;
        }

        let currentStep = 0;
        if (numOfReachable == 1)
        {
            let degree = 2 * Math.PI / numOfNode;
            for (const node of graph.getNodes())
            {
                node.y = Math.sin(degree * currentStep + Math.PI) * radius;
                node.x = Math.cos(degree * currentStep + Math.PI) * radius;
                currentStep += 1;
            }
        }
        else 
        {
            const degree_re = 2 * Math.PI / numOfReachable;
            const degree_un = 2 * Math.PI / numOfUnreachable;

            currentStep = 0;
            for (const node of reachableNode)
            {
                node.y = Math.sin(degree_re * currentStep + Math.PI) * radius;
                node.x = Math.cos(degree_re * currentStep + Math.PI) * radius;
                currentStep += 1;
            }
            currentStep = 0;
            for (const node of unreachableNode)
            {
                node.y = Math.sin(degree_un * currentStep + Math.PI) * (radius + 100);
                node.x = Math.cos(degree_un * currentStep + Math.PI) * (radius + 100);
                currentStep += 1;
            }
        }
        /*for(const node of graph.getNodes())
        {
          node.y = Math.sin(degree*currentStep + Math.PI)*radius;
          node.x = Math.cos(degree*currentStep + Math.PI)*radius;
          currentStep += 1
        }*/
    }


}

export default GraphLayout;
