import MainCursorController from 'controller/cursor/MainCursorController.js';
import MainButtonController from 'controller/button/MainButtonController.js';
import GraphParser from 'parser/GraphParser.js';

import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import { solveDFA } from 'machine/util/solveDFA.js';
import { solveNFA } from 'machine/util/solveNFA.js';

import * as Config from 'config.js';

class GraphController
{
  constructor(viewport, graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;
    this.viewport = viewport;

    this.cursors = new MainCursorController(this.graph, this.mouse);
    this.buttons = new MainButtonController(this.viewport, this.graph, this.cursors);

    this.parser = new GraphParser(this.graph);

    this.mode = new ModeNFA(this);

    //TODO: Tester does not work with symbols greater than one character!
    const inputTest = document.getElementById("test_input")
    const buttonTest = document.getElementById("test_execute");
    buttonTest.addEventListener('click', (event) => {
      alert(this.test((inputTest.value || "")[Symbol.iterator]()) ? "SUCCESS!" : "FAILED!");
      inputTest.select();
    });
    inputTest.addEventListener('keyup', (e) => {
      if (e.keyCode == Config.SUBMIT_KEY)
      {
        buttonTest.click();
      }
    });
  }

  initialize()
  {
    this.cursors.load();
    this.buttons.load();

    this.mode.activate();
  }

  test(input)
  {
    const nfa = new NFA();
    for(const node of this.graph.nodes)
    {
      const state = nfa.newState(node.label);
      if (node.accept)
      {
        nfa.setFinalState(state);
      }
    }

    for(const edge of this.graph.edges)
    {
      for(const label of edge.label.split(" "))
      {
        nfa.newTransition(edge.from.label, edge.to ? edge.to.label : "undefined", label);
      }
    }

    nfa.setStartState(this.graph.getInitialState().label);

    return solveNFA(nfa, input);
  }

  update(dt)
  {
    this.cursors.update(dt);
    this.buttons.update(dt);
  }
}

class ModeDFA
{
  constructor(controller)
  {
    this.controller = controller;
    this._onEdgeCreate = this.onEdgeCreate.bind(this);
    this._onEdgeDestroy = this.onEdgeDestroy.bind(this);

    //TODO: create transitions (or symbols) in order to be deterministic
    //TODO: delete transitions (or symbols) if all are placeholders
  }

  onEdgeCreate(edge)
  {

  }

  onEdgeDestroy(edge)
  {

  }

  activate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = false;
    this.controller.graph.addListener("edgeCreate", this._onEdgeCreate);
    this.controller.graph.addListener("edgeDestroy", this._onEdgeDestroy);
  }

  deactivate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
    this.controller.graph.removeListener("edgeCreate", this._onEdgeCreate);
    this.controller.graph.removeListener("edgeDestroy", this._onEdgeDestroy);
  }
}

class ModeNFA
{
  constructor(controller)
  {
    this.controller = controller;
  }

  activate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = true;
  }

  deactivate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
  }
}

export default GraphController;
