import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA, convertToDFA } from '../FSAUtils.js';
import FSAGraph from 'modules/fsa/graph/FSAGraph.js';
import FSABuilder from 'modules/fsa2/machine/FSABuilder.js';

function testSolveFSA(machine, testString, expectedResult=true)
{
  test("test string \'" + testString + "\'", () => {
    expect(solveFSA(machine, testString)).toBe(expectedResult);
  });
}

describe("Trying to convert an empty NFA machine", () => {
  const dfa = new FSA(false);
  const graph = new FSAGraph();
  const builder = new FSABuilder();
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  const q3 = dfa.createState("q3");
  dfa.addTransition(q1,q1,"b");
  dfa.addTransition(q1,q2,"a");
  dfa.addTransition(q2,q3,"a");
  dfa.addTransition(q2,q3,"b");
  dfa.addTransition(q3,q2,"a");
  dfa.addTransition(q3,q1,"b");


  dfa.setFinalState(q2);
  builder.getMachine().copy(dfa);
  builder.attemptBuildGraph(dfa, graph);

  test("start state is correct?", () => {
    expect(graph.getStartNode().getNodeLabel()).toEqual("q1");
    expect(dfa.validate()).toBe(true);
    expect(dfa.isValid()).toBe(true);
  });
});
