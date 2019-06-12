import 'index.js';
import FSA, { EMPTY_SYMBOL } from 'modules/fsa2/machine/FSA.js';
import FSAJFFExporter from 'modules/fsa2/filehandlers/FSAJFFExporter.js';
import * as FSAGraphParser from 'modules/fsa2/FSAGraphParser.js';
import FSAGraph from 'modules/fsa2/graph/FSAGraph.js';
import FSABuilder from 'modules/fsa2/machine/FSABuilder.js';

const exporter = new FSAJFFExporter(FSAGraphParser.XML);
const fsa = new FSA()
const graph = new FSAGraph();
const builder = new FSABuilder();
const name = '';
resetSession(){
  fsa = new FSA();
  graph = graph.clear();
  builder = new FSABuilder();
  name = '';
}

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
        return name;
    }
};
// Example 1_1_m1
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");
dfa.addTransition(q1,q1,"b");
dfa.addTransition(q1,q2,"a");
dfa.addTransition(q2,q3,"a");
dfa.addTransition(q2,q3,"b");
dfa.addTransition(q3,q1,"b");
dfa.addTransition(q3,q1,"a");
dfa.setFinalState(q2);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_1_m1'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_1_m2
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");
const q4 = dfa.createState("q4");
dfa.addTransition(q1,q1,"a");
dfa.addTransition(q1,q2,"b");
dfa.addTransition(q2,q3,"a");
dfa.addTransition(q3,q2,"a");
dfa.addTransition(q2,q4,"b");
dfa.addTransition(q4,q4,"b");
dfa.addTransition(q4,q3,"a");
dfa.addTransition(q3,q1,"b");
dfa.setFinalState(q2);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_1_m2'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_3
const q3 = dfa.createState("q3");
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q4 = dfa.createState("q4");
const q5 = dfa.createState("q5");
dfa.addTransition(q1,q1,"u");
dfa.addTransition(q1,q2,"d");
dfa.addTransition(q2,q1,"u");
dfa.addTransition(q2,q3,"d");
dfa.addTransition(q3,q2,"u");
dfa.addTransition(q3,q4,"d");
dfa.addTransition(q4,q3,"u");
dfa.addTransition(q4,q5,"d");
dfa.addTransition(q5,q4,"u");
dfa.addTransition(q5,q5,"d");
dfa.setFinalState(q3);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_3'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_16_b
const q3 = dfa.createState("1");
const q1 = dfa.createState("2");
const q2 = dfa.createState("3");
dfa.addTransition(q1,q2,EMPTY_SYMBOL);
dfa.addTransition(q2,q1,"a");
dfa.addTransition(q1,q3,"a");
dfa.addTransition(q3,q2,"a");
dfa.addTransition(q3,q2,"b");
dfa.addTransition(q3,q3,"b");
dfa.setFinalState(q2);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_16_b'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_16_a
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
dfa.addTransition(q1,q1,"a");
dfa.addTransition(q1,q2,"a");
dfa.addTransition(q1,q2,"b");
dfa.addTransition(q2,q1,"b");
dfa.setFinalState(q1);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_16_a'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_7
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
dfa.addTransition(q1,q1,"0");
dfa.addTransition(q1,q2,"1");
dfa.addTransition(q2,q2,"1");
dfa.addTransition(q2,q1,"0");
dfa.setFinalState(q2);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_7'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_41
const q1 = dfa.createState("1");
const q2 = dfa.createState("2");
const q2 = dfa.createState("3");
dfa.addTransition(q1,q2,"b");
dfa.addTransition(q2,q2,"a");
dfa.addTransition(q2,q3,"a");
dfa.addTransition(q2,q3,"b");
dfa.addTransition(q3,q1,"a");
dfa.addTransition(q1,q3,EMPTY_SYMBOL);
dfa.setFinalState(q1);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_41'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_38
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");
const q4 = dfa.createState("q4");

dfa.addTransition(q1,q1,"1");
dfa.addTransition(q1,q1,"0");
dfa.addTransition(q1,q2,"1");
dfa.addTransition(q2,q3,"0");
dfa.addTransition(q2,q3,EMPTY_SYMBOL);
dfa.addTransition(q3,q4,"1");
dfa.addTransition(q4,q4,"0");
dfa.addTransition(q4,q4,"1");
dfa.setFinalState(q4);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_38'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_35
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");


dfa.addTransition(q1,q2,"b");
dfa.addTransition(q2,q2,"a");
dfa.addTransition(q2,q3,"a");
dfa.addTransition(q2,q3,"b");
dfa.addTransition(q3,q1,"a");
dfa.addTransition(q1,q3,EMPTY_SYMBOL);
dfa.setFinalState(q1);

builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_35'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_33
const q0 = dfa.createState("q0");
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");
const q4 = dfa.createState("q4");
const q5 = dfa.createState("q5");

dfa.addTransition(q0,q1,EMPTY_SYMBOL);
dfa.addTransition(q0,q3,EMPTY_SYMBOL);
dfa.addTransition(q1,q2,"0");
dfa.addTransition(q2,q1,"0");
dfa.addTransition(q3,q4,"0");
dfa.addTransition(q4,q5,"0");
dfa.addTransition(q5,q3,"0");
dfa.setFinalState(q1);
dfa.setFinalState(q3);


builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_33'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_30
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const q3 = dfa.createState("q3");
const q4 = dfa.createState("q4");

dfa.addTransition(q1,q1,"0");
dfa.addTransition(q1,q1,"1");

dfa.addTransition(q1,q2,"1");
dfa.addTransition(q2,q3,"0");
dfa.addTransition(q2,q3,"1");
dfa.addTransition(q3,q4,"0");
dfa.addTransition(q3,q4,"1");
dfa.setFinalState(q4);


builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_30'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_21
const q = dfa.createState("q");
const q0 = dfa.createState("q0");
const q0 = dfa.createState("q00");
const q001 = dfa.createState("q001");

dfa.addTransition(q,q,"1");
dfa.addTransition(q,q0,"0");
dfa.addTransition(q0,q,"1");
dfa.addTransition(q0,q00,"0");
dfa.addTransition(q00,q00,"0");
dfa.addTransition(q00,q001,"1");
dfa.addTransition(q001,q001,"0");
dfa.addTransition(q001,q001,"1");
dfa.setFinalState(q001);


builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_21'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_13
const q0 = dfa.createState("q0");
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const r = "<RESET>"
dfa.addTransition(q0,q0,"0");
dfa.addTransition(q0,q0,r);
dfa.addTransition(q0,q1,"1");
dfa.addTransition(q1,q0,"2");
dfa.addTransition(q1,q0,r);
dfa.addTransition(q1,q1,"0");
dfa.addTransition(q1,q2,"1");
dfa.addTransition(q2,q2,"0");
dfa.addTransition(q2,q1,"2");
dfa.addTransition(q2,q0,"1");
dfa.addTransition(q2,q1,r);
dfa.addTransition(q1,q2,"2");
dfa.setFinalState(q0);


builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_13'
exporter.exportTarget('', mockSession)
resetSession();

// Example 1_11
const s = dfa.createState("s");
const q1 = dfa.createState("q1");
const q2 = dfa.createState("q2");
const r1 = dfa.createState("r1");
const r2 = dfa.createState("r2");

dfa.addTransition(s,q1,"a");
dfa.addTransition(q1,q1,"a");
dfa.addTransition(q1,q2,"b");
dfa.addTransition(q2,q2,"b");
dfa.addTransition(q2,q1,"a");
dfa.addTransition(s,r1,"b");
dfa.addTransition(r1,r1,"b");
dfa.addTransition(r1,r2,"a");
dfa.addTransition(r2,r2,"a");
dfa.addTransition(r2,r1,"b");
dfa.setFinalState(q1);
dfa.setFinalState(r1);


builder.getMachine().copy(dfa);
builder.attemptBuildGraph(dfa, graph);
name = 'flapjs1_11'
exporter.exportTarget('', mockSession)
resetSession();


exporter.exportTarget('', mockSession).then(result =>
{
    console.log(result);
});
//zip.file(targetData.name, targetData.data);
