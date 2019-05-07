const EDGE_RADIUS = 12;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;
const ENDPOINT_RADIUS = 6;
const ENDPOINT_RADIUS_SQU = ENDPOINT_RADIUS * ENDPOINT_RADIUS;

class GraphPicker
{
    constructor()
    {
        this.selectionBox = {
            fromX: 0, fromY: 0,
            toX: 0, toY: 0,
            visible: false
        };
        this.targets = [];

        this.target = null;
        this.targetType = '';

        this.initialTarget = null;
        this.initialTargetType = '';
    }

    setInitialTarget(target, type)
    {
        this.initialTarget = target;
        this.initialTargetType = type;
    }

    updateTarget(graph, x, y)
    {
        if (this.target = this.getNodeByInitialMarkerAt(graph, x, y))
        {
            //Clicked on initial marker
            this.targetType = 'initial';
        }
        else if (this.target = this.getEdgeByEndPointAt(graph, x, y))
        {
            //Clicked on endpoint
            this.targetType = 'endpoint';
        }
        else if (this.target = this.getNodeAt(graph, x, y))
        {
            //Clicked on node
            this.targetType = 'node';
        }
        else if (this.target = this.getEdgeAt(graph, x, y))
        {
            //Clicked on edge
            this.targetType = 'edge';
        }
        else
        {
            //Clicked on graph
            this.target = null;
            this.targetType = 'none';
        }

        return this.target;
    }

    clearTarget()
    {
        this.target = null;
        this.targetType = 'none';
    }

    hasTarget()
    {
        return this.target != null;
    }

    getNodeAt(graph, x, y)
    {
    //Search graph
        for(const node of graph.getNodes())
        {
            const nodeSize = node.getNodeSize();
            const dx = x - node.x;
            const dy = y - node.y;
            if (dx * dx + dy * dy < nodeSize * nodeSize)
            {
                return node;
            }
        }
        return null;
    }

    getNodeByInitialMarkerAt(graph, x, y)
    {
        const startNode = graph.getStartNode();
        if (!startNode) return null;

        const nodeSize = startNode.getNodeSize();
        const offset = -(nodeSize + (nodeSize / 2));
        const dx = x - (startNode.x + offset);
        const dy = y - startNode.y;
        if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
        {
            return startNode;
        }

        return null;
    }

    getEdgeAt(graph, x, y)
    {
        const center = {x: 0, y: 0};

        //Search graph
        for(const edge of graph.getEdges())
        {
            edge.getCenterPoint(center);
            const dx = x - center.x;
            const dy = y - center.y;
            if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
            {
                return edge;
            }
        }
        return null;
    }

    getEdgeByEndPointAt(graph, x, y)
    {
        const end = {x: 0, y: 0};
        //Search graph
        for(const edge of graph.getEdges())
        {
            edge.getEndPoint(end);
            const dx = x - end.x;
            const dy = y - end.y;
            if (dx * dx + dy * dy < ENDPOINT_RADIUS_SQU)
            {
                return edge;
            }
        }
        return null;
    }

    getSelectionBox()
    {
        return this.selectionBox;
    }

    getSelection(graph, forceUpdate=false)
    {
        if (forceUpdate)
        {
            const box = this.selectionBox;
            const mx = Math.max(box.toX, box.fromX);
            const my = Math.max(box.toY, box.fromY);
            const lx = Math.min(box.toX, box.fromX);
            const ly = Math.min(box.toY, box.fromY);
            this.clearSelection();
            getNodesWithin(graph, lx, ly, mx, my, this.targets);
        }

        return this.targets;
    }

    hasSelection()
    {
        return this.targets.length > 0;
    }

    clearSelection()
    {
        this.targets.length = 0;
    }

    isTargetInSelection(target)
    {
        return this.targets.includes(target || this.target);
    }

    isTarget(target)
    {
        return this.target == target;
    }

    beginSelection(graph, x, y)
    {
        const box = this.selectionBox;
        box.fromX = box.toX = x;
        box.fromY = box.toY = y;
        this.clearSelection();

        box.visible = true;
    }

    updateSelection(graph, x, y)
    {
        const box = this.selectionBox;
        box.toX = x;
        box.toY = y;
        this.getSelection(graph, true);
    }

    endSelection(graph, x, y)
    {
        const box = this.selectionBox;
        box.toX = x;
        box.toY = y;
        this.getSelection(graph, true);

        box.visible = false;
    }

    isSelecting()
    {
        return this.selectionBox.visible;
    }
}

function getNodesWithin(graph, x1, y1, x2, y2, dst)
{
    const fromX = Math.min(x1, x2);
    const fromY = Math.min(y1, y2);
    const toX = Math.max(x1, x2);
    const toY = Math.max(y1, y2);

    for(const node of graph.getNodes())
    {
        if (node.x >= fromX && node.x < toX &&
        node.y >= fromY && node.y < toY)
        {
            dst.push(node);
        }
    }
    return dst;
}

export default GraphPicker;
