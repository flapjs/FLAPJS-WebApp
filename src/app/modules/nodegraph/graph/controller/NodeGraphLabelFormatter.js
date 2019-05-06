import LabelFormatter from 'graph2/controller/LabelFormatter';

import GraphNode from 'graph2/element/GraphNode.js';
import GraphEdge from 'graph2/element/GraphEdge.js';

class NodeGraphLabelFormatter extends LabelFormatter
{
	constructor(graph)
	{
		super();

		this._graph = graph;
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
	getDefaultNodeLabel() { return ""; }
	getDefaultEdgeLabel() { return ""; }
	getGraph() { return this._graph; }
}

export default NodeGraphLabelFormatter;