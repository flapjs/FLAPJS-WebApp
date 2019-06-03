import 'index.js';
import FSAJFFExporter from 'modules/fsa2/filehandlers/FSAJFFExporter.js';
import * as FSAGraphParser from 'modules/fsa2/FSAGraphParser.js';
import FSAGraph from 'modules/fsa2/graph/FSAGraph.js';

const exporter = new FSAJFFExporter(FSAGraphParser.XML);
const graph = new FSAGraph();

const result = graph.createNode();
console.log(graph._nodeMapping.values());
console.log()
console.log(graph, result);


const mockSession = {
    getCurrentModule()
    {
        return {
            getModuleName() { return 'fsa'; },
            getModuleVersion() { return '0.0.0'; },
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
    },
    getProjectName()
    {
        return 'YourGraphName';
    }
};

console.log("HELLO");
console.log(exporter);

exporter.exportTarget('', mockSession).then(result =>
{
    console.log(result);
});
//zip.file(targetData.name, targetData.data);

graph.clear();