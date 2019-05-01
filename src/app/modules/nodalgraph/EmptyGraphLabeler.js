import AbstractGraphLabeler from 'graph/AbstractGraphLabeler.js';

class EmptyGraphLabeler extends AbstractGraphLabeler
{
    constructor()
    {
        super();
    }

    //TODO: this is from GraphController (refactor this out of here pls)
    setGraphController(getGraphController) {}

    /** @override */
    getDefaultNodeLabel() { return ""; }

    /** @override */
    getDefaultEdgeLabel() { return ""; }

    /** @override */
    getNodeLabelFormatter() { return labelFormatter; }

    /** @override */
    getEdgeLabelFormatter() { return labelFormatter; }
}

function labelFormatter(string)
{
    return string || "";
}

export default EmptyGraphLabeler;
