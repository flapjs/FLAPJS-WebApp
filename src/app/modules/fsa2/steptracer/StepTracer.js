class StepTracer
{
    constructor(graphController, machineController)
    {
        this._graphController = graphController;
        this._machineController = machineController;

        this._currentSymbols = [];
        this._currentNode = null;
        this._nextEdges = [];
        this._prevEdges = [];

        this._expectedString = null;
    }

    setExpectedString(string)
    {
        this._expectedString = string;
    }

    updateNextEdges()
    {
        const graph = this._graphController.getGraph();
        const node = this._currentNode;
        this._nextEdges.length = 0;
        for(const edge of graph.getEdges())
        {
            if (edge.getEdgeFrom() === node)
            {
                this._nextEdges.push(edge);
            }
        }
    }

    nextEdge(edge)
    {
        if (!this._nextEdges.includes(edge)) throw new Edge('Must use edge from this._nextEdges');
        if (this._nextEdges.length <= 0) return;

        this._prevEdges.push(edge);
        const symbols = edge.getEdgeSymbolsFromLabel();
        //FIXME: there needs to be a way to select which symbols you want to use
        this._currentSymbols.push(symbols[0]);
        this._currentNode = edge.getEdgeTo();
        this.updateNextEdges();
    }

    prevEdge()
    {
        if (this._prevEdges.length <= 0) return;

        const edge = this._prevEdges.pop();
        this._currentNode = edge.getEdgeFrom();
        this.updateNextEdges();
    }

    getPrevEdges()
    {
        return this._prevEdges;
    }

    getNextEdges()
    {
        return this._nextEdges;
    }

    getExpectedString()
    {
        return this._expectedString;
    }

    getCurrentSymbols()
    {
        return this._currentSymbols;
    }

    getCurrentNode()
    {
        return this._currentNode;
    }

    getCurrentString()
    {
        return this._currentSymbols.join('');
    }

    isAcceptedString()
    {
        if (this._expectedString)
        {
            return this._expectedString === this._currentSymbols.join('');
        }
        else
        {
            return this._currentNode !== null && this._currentNode.getNodeAccept();
        }
    }
}

export default StepTracer;
