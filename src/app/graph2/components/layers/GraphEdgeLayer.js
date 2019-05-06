import React from 'react';

import GraphEdgeRenderer from '../../renderer/GraphEdgeRenderer.js';

class GraphEdgeLayer extends React.Component
{
	constructor(props) { super(props); }

	/** @override */
	render()
	{
		const inputController = this.props.inputController;
		const onMouseOver = this.props.onMouseOver;
		const onMouseOut = this.props.onMouseOut;
		
		const edges = [];
		for(const edge of this.props.edges)
		{
			edges.push(
				<GraphEdgeRenderer
					key={edge.getGraphElementID()}
					edge={edge}
					onMouseOver={onMouseOver}
					onMouseOut={onMouseOut}
					pointerEvents={inputController.hasPointerEvents(edge) ? "all" : "none"} />
			);
		}

		return (
			<g>
				{edges}
			</g>
		);
	}
}

export default GraphEdgeLayer;