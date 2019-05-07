import LabelFormatter from 'graph/controller/LabelFormatter';

// import { SYMBOL_SEPARATOR } from 'modules/fsa/graph/FSAEdge.js';
// import { EMPTY } from 'modules/fsa/machine/Symbols.js';

const DEFAULT_NODE_LABEL_PREFIX = 'q';

import GraphNode from 'graph2/element/GraphNode.js';
import GraphEdge from 'graph2/element/GraphEdge.js';

class NodeGraphLabelFormatter extends LabelFormatter
{
    constructor(graph)
    {
        super();

        this._graph = graph;

        this._autorename = false;
        this._prefix = DEFAULT_NODE_LABEL_PREFIX;
    }

    setAutoRenameForNodes(flag)
    {
        this._autorename = flag;
        return this;
    }

    setDefaultNodeLabelPrefix(prefix)
    {
        this._prefix = prefix;
        return this;
    }

    getDefaultNodeLabelPrefix()
    {
        return this._prefix;
    }

    /** @override */
    formatLabel(target, nextLabel, prevLabel = null)
    {
        if (target instanceof GraphNode)
        {
            return this.formatNodeLabel(nextLabel, prevLabel);
        }
        else if (target instanceof GraphEdge)
        {
            return this.formatEdgeLabel(nextLabel, prevLabel);
        }
        else
        {
            return super.formatLabel(target, nextLabel, prevLabel);
        }
    }

    /** @override */
    getDefaultLabel(target)
    {
        if (target instanceof GraphNode)
        {
            return this.getDefaultNodeLabel();
        }
        else if (target instanceof GraphEdge)
        {
            return this.getDefaultEdgeLabel();
        }
        else
        {
            return super.getDefaultLabel(target);
        }
    }

    formatNodeLabel(nextNodeLabel, prevNodeLabel = null)
    {
        return nextNodeLabel;
    }

    formatEdgeLabel(nextEdgeLabel, prevEdgeLabel = null)
    {
        return nextEdgeLabel;
    }

    getDefaultNodeLabel()
    {
        if (!this._autorename)
        {
            return this.getDefaultNodeLabelPrefix();
        }
        else
        {
            const graph = this._graph;
            const otherNodes = [];
            let nodeIndex = 0;

            const startNode = graph.getStartNode();
            if (startNode && startNode.getNodeCustom()) nodeIndex = 1;

            let newNodeLabel = this.getDefaultNodeLabelPrefix() + nodeIndex;
            while (graph.getNodesByLabel(newNodeLabel, otherNodes).length > 0)
            {
                otherNodes.length = 0;
                ++nodeIndex;
                newNodeLabel = this.getDefaultNodeLabelPrefix() + nodeIndex;
            }

            return newNodeLabel;
        }
    }
	
    getDefaultEdgeLabel() { return ''; }

    getAutoRenameForNodes() { return this._autorename; }
    getGraph() { return this._graph; }
}

export default NodeGraphLabelFormatter;