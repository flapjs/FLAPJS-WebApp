import NFA from 'machine/NFA.js';
import { EMPTY } from 'machine/Symbols.js';
import NodalGraph from 'graph/NodalGraph';

const ERROR_CHECK_INTERVAL = 2000;

class FSABuilder
{
  //HACK: this should not take app
  constructor(graph, app)
  {
    this.graph = graph;

    this._machine = new NFA();

    //HACK: this is a quick and dirty way to error check notifications...
    this.graph.on("markDirty", (g)=>{
      if (this.errorChecker)
      {
        clearTimeout(this.errorChecker);
        this.errorChecker = null;
      }
      this.errorChecker = setTimeout(()=>{
        //HACK: this is to turn off error checking really quick
        if (!app.testingManager.autoErrorCheck) return;

        this.checkErrors();
        for(const [error, objects] of this.errorMessages)
        {
          //TODO: this should notify the user and highlight the error
          let message = error + ": ";
          for(const o of objects)
          {
            message += o.label + ", ";
          }
          app.notification.addMessage(message);
        }
      }, ERROR_CHECK_INTERVAL);
    });

    this.errorMessages = new Map();
    this.errorNodes = [];
    this.errorEdges = [];
  }

  checkErrors()
  {
    this.errorMessages = new Map();
    let nodeTransitionMap = new Map();
    let unReachedNode =this.graph.nodes.slice();
    let startNode = this.graph.getStartNode();
    unReachedNode.splice(unReachedNode.indexOf(startNode),1);
    this.getMachine();//HACK: this is to sync the machine and graph
    let alphabet = this._machine.getAlphabet();
    for(const edge of this.graph.edges)
    {
      //check incomplete edges
      if (edge.isPlaceholder())
      {
        this.errorEdges.push(edge);
        this.addErrorMessage("Incomplete edges", edge);
      }
      else
      {
        const from = edge.from;
        const to = edge.to;
        const labels = edge.label.split(",");
        for(const label of labels)
        {
          //remove to from unReachedNode list
          if(unReachedNode.includes(to)) unReachedNode.splice(unReachedNode.indexOf(to),1);
          //check for empty transitions
          if(label == EMPTY)
          {
            this.errorEdges.push(edge);
            this.addErrorMessage("Empty transitions", edge);
          }
          else
          {
            if(typeof nodeTransitionMap.get(from) === "undefined")
            {
              nodeTransitionMap.set(from, [label]);
            }
            else
            {
              //check for duplicate transitions
              let currentAlphabet = nodeTransitionMap.get(from);
              if(currentAlphabet.includes(label))
              {
                this.errorEdges.push(edge);
                this.addErrorMessage("Duplicate transitions", edge)
              }
              else
              {
                nodeTransitionMap.get(from).push(label);
              }
            }
          }
        }
      }
    }
    //check disconnect states
    for (const node of unReachedNode)
    {
      this.errorNodes.push(node);
      this.addErrorMessage("Unreachable node", node);
    }
    //Check for missing transitions
    for(const node of this.graph.nodes)
    {
      let nodeTransitions = nodeTransitionMap.get(node);
      if (typeof nodeTransitions === "undefined"&& alphabet.length != 0)
      {
        this.errorNodes.push(node);
        this.addErrorMessage("Missing transitions", node);
      }
      else if(typeof nodeTransitions != "undefined" && nodeTransitions.length < alphabet.length)
      {
        this.errorNodes.push(node);
        this.addErrorMessage("Missing transitions", node);
      }
    }
  }

  //helper method for add into errorMessages map
  addErrorMessage(error, object)
  {
    if(typeof this.errorMessages.get(error) === "undefined")
    {
      this.errorMessages.set(error, [object]);
    }
    else
    {
      this.errorMessages.get(error).push(object);
    }
  }


  getMachine()
  {
    this._machine.clear();
    return this.graph._toNFA(this._machine);
  }
}

export default FSABuilder;
