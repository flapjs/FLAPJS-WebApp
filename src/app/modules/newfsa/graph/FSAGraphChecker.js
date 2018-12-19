export function checkErrors(graph)
{
  const errors = [];
  if (fsa.isDeterministic())
  {

  }
  else
  {
  }
  return errors;
}

export function getUnreachableStates(graph)
{

}

export function getMissingTransitions(graph)
{
  for(const node of graph.getNodes())
  {
    
  }
  for(const state of fsa.getStates())
  {

  }
}

export function getDuplicateStates(graph)
{
  const result = new Map();
  const stateLabels = new Set();
  for(const state of fsa.getStates())
  {
    const label = state.getStateLabel();
    if (stateLabels.has(label))
    {
      if (result.has(label))
      {
        const states = result.get(label);
        states.push(state);
      }
      else
      {
        const states = [state];
        result.set(label, states);
      }
    }
    else
    {
      stateLabels.add(label);
    }
  }
  return result;
}

export function getDuplicateTransitions(graph)
{

}

export function getEmptyTransitions(graph)
{
  const result = [];
  for(const transition of fsa.getTransitions())
  {
    if (transition.hasSymbol(FSA.EMPTY_SYMBOL))
    {
      result.push(transition);
    }
  }
  return result;
}

export function getPlaceholderTransitions(graph)
{
  const result = [];
  for(const transition of fsa.getTransitions())
  {
    if (transition.getDestin)
    {
      result.push(transition);
    }
  }
  return result;
}

//Unreachable States (cannot be reached from start state)
//Missing Transition (missing transition for state)
//Dupe States (states with the same name)
//Dupe Transition (duplicate symbol transitions)
//Invalid Transition (empty transitions)
//Incomplete transitions (placeholders)
class FSAErrorChecker
{
  constructor(fsa)
  {
    this._machine = fsa;
    this._errors = [];
  }

  checkErrors()
  {
    if (this._machine.isDeterministic())
    {
      return this.checkDFAErrors();
    }
    else
    {
      return this.checkNFAErrors();
    }
  }

  checkDFAErrors()
  {
    this._errors.length = 0;

    const nodeTransitions = new Map();

    return this._errors;
  }

  checkNFAErrors()
  {
    this._errors.length = 0;
    return this._errors;
  }
}
export default FSAErrorChecker;
