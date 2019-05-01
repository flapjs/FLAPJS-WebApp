import GraphElementInputHandler from './GraphElementInputHandler.js';

class GraphNodeAcceptInputHandler extends GraphElementInputHandler
{
  constructor()
  {
    super("node");
  }

  /** @override */
  onAction(inputController, graphController, pointer, target)
  {
    //Edit click to toggle node
    if (!inputController.isMoveMode())
    {
      graphController.toggleNode(target);
      return true;
    }

    return false;
  }
}

export default GraphNodeAcceptInputHandler;
