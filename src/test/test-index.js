import '../app/index.js';
import FSAJFFExporter from 'modules/fsa2/filehandlers/FSAJFFExporter.js';
import * as FSAGraphParser from 'modules/fsa2/FSAGraphParser.js';
import FSAGraph from 'modules/fsa2/graph/FSAGraph.js';

const exporter = new FSAJFFExporter(FSAGraphParser.XML);
const graph = new FSAGraph();

graph.createNode(0, 0);

const mockSession = {
    getCurrentModule()
    {
        return {
            getGraphController()
            {
                return {
                    getGraph()
                    {
                        return graph;
                    }
                };
            }
        };
    }
};

exporter.exportTarget('', mockSession).then(result =>
{
    console.log(result);
});
//zip.file(targetData.name, targetData.data);

graph.clear();

console.log(graph);