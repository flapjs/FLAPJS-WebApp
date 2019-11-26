export function forEach(astNode, callback)
{
    if (!astNode) return;

    let currentNode;
    let nextNodes = [ astNode ];
    while (nextNodes.length > 0)
    {
        currentNode = nextNodes.shift();
        callback(currentNode);

        if (currentNode.hasChildren())
        {
            for(let child of currentNode.getChildren())
            {
                nextNodes.push(child);
            }
        }
    }
}
