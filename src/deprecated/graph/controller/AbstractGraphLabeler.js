import GraphEdge from '../model/elements/GraphEdge.js';

class AbstractGraphLabeler
{
    constructor() { }

    getDefaultLabel(target)
    {
        if (target instanceof GraphEdge)
        {
            return this.getDefaultEdgeLabel();
        }
        else
        {
            return this.getDefaultNodeLabel();
        }
    }

    getLabelFormatter(target)
    {
        if (target instanceof GraphEdge)
        {
            return this.getEdgeLabelFormatter();
        }
        else
        {
            return this.getNodeLabelFormatter();
        }
    }

    //Deprecated - use getDefaultLabel()
    getDefaultNodeLabel()
    {
        return '';
    }

    //Deprecated - use getDefaultLabel()
    getDefaultEdgeLabel()
    {
        return '';
    }

    //Deprecated - use getDefaultLabel()
    getNodeLabelFormatter()
    {
        throw new Error('Node label formatting is not supported');
    }

    //Deprecated - use getDefaultLabel()
    getEdgeLabelFormatter()
    {
        throw new Error('Edge label formatting is not supported');
    }
}

export default AbstractGraphLabeler;
