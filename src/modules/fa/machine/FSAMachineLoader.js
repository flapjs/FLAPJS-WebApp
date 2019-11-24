import TextUploader from '@flapjs/services/import/TextUploader.js';
import FSAGraphParser from '@flapjs/modules/fa/loaders/FSAGraphParser.js';
import FSAGraph from '@flapjs/modules/fa/graph/FSAGraph.js';
import FSABuilder from '@flapjs/modules/fa/machine/FSAMachineBuilder.js';
import FSA from '@flapjs/modules/fa/machine/FSA.js';

export function createMachineFromFileBlob(fileBlob)
{
    return new Promise((resolve, reject) =>
    {
        new TextUploader().uploadFile(fileBlob)
            .then(result =>
            {
                const fileData = JSON.parse(result);

                const graphParser = new FSAGraphParser();
                const graph = new FSAGraph();
                graphParser.parse(fileData['graphData'], graph);

                const machineBuilder = new FSABuilder();
                const machine = new FSA();
                machineBuilder.attemptBuildMachine(graph, machine);
                
                if (machine)
                {
                    resolve(machine);
                }
                else
                {
                    resolve(null);
                }
            });
    });
}
