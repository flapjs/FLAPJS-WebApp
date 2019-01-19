class GraphElementInputHandler
{
  constructor()
  {

  }

  onAction(inputController, graphController, pointer, target)
  {
    return false;
  }

  onDragStart(inputController, graphController, pointer, target)
  {
    return false;
  }

  onDragMove(inputController, graphController, pointer, target)
  {
    return false;
  }

  onDragStop(inputController, graphController, pointer, target)
  {
    return false;
  }

  getTargetType()
  {
    throw new Error("Missing target type for GraphElementInputHandler");
  }
}

export default GraphElementInputHandler;
