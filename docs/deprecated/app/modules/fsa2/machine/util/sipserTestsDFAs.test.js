import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA, convertToDFA } from '../FSAUtils.js';
import FSAGraph from 'modules/fsa2/graph/FSAGraph.js';
import FSABuilder from 'modules/fsa2/machine/FSABuilder.js';

function testSolveFSA(machine, testString, expectedResult=true)
{
  test("test string \'" + testString + "\'", () => {
    expect(solveFSA(machine, testString)).toBe(expectedResult);
  });
}
//Exmples
describe("Example 1.7 Page 37", () => {
  const dfa = new FSA(false);
  const graph = new FSAGraph();
  const builder = new FSABuilder();
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  dfa.addTransition(q1,q1,"0");
  dfa.addTransition(q1,q2,"1");
  dfa.addTransition(q2,q2,"1");
  dfa.addTransition(q2,q1,"0");
  dfa.setFinalState(q2);

  builder.getMachine().copy(dfa);
  builder.attemptBuildGraph(dfa, graph);

  test("start state is correct?", () => {
    expect(graph.getStartNode().getNodeLabel()).toBe("q1");
    expect(graph.getNodesByLabel("q2")[0].getNodeAccept()).toBe(true);
    expect(dfa.validate()).toBe(true);
    expect(dfa.isValid()).toBe(true);
  });
});
//Exercises
describe("Exercise 1.1", () => {
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
    expect(graph.getStartNode().getNodeLabel()).toBe("q1");
    expect(dfa.validate()).toBe(true);
    expect(dfa.isValid()).toBe(true);
  });
});
