class AbstractGraphController
{
    constructor(module, graph, labeler, parser)
    {
        if (!module) throw new Error('Missing module for graph controller');
        if (!graph) throw new Error('Missing graph for graph controller');
        if (!labeler) throw new Error('Missing graph labeler for graph controller');
        if (!parser) throw new Error('Missing graph parser for graph controller');

        this._module = module;
        this._graph = graph;
        this._labeler = labeler;
        this._parser = parser;
    }

    initialize(module) {}
    destroy(module) {}
    update(module) {}

    getGraphParser(type='JSON')
    {
        const parsers = this._parser;
        if (parsers && type in parsers)
        {
            return parsers[type];
        }
        else
        {
            throw new Error('Unsupported type for graph parser \'' + type + '\'');
        }
    }
    getGraphLabeler() { return this._labeler; }
    getGraph() { return this._graph; }
    getModule() { return this._module; }
}

export default AbstractGraphController;
