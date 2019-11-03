class NodeGraphLoader
{
    constructor(parser)
    {
        this.parser = parser;
    }

    fromFileBlob(fileBlob)
    {
        const fileData = fileBlob;
        return NodeGraphLoader.fromFileData(fileData['graphData']);
    }

    fromFileData(fileData)
    {
        // const data = JSON.parse(fileData);
        // this.parser.parse(data, graph);
    }
}

const INSTANCE = new NodeGraphLoader();
export default INSTANCE;
