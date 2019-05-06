import NodeGraphController from 'modules/nodalgraph/graph/controller/NodeGraphController.js';
import FSAGraphParser from '../FSAGraphParser.js';
import FSAGraphLabelFormatter from './FSAGraphLabelFormatter.js';

class FSAGraphController extends NodeGraphController
{
	constructor(app, graph)
	{
		super(app, graph, new FSAGraphParser());

		this.setLabelFormatter(new FSAGraphLabelFormatter(graph));
	}
}

export default FSAGraphController;