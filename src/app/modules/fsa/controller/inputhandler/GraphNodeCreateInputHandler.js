import InputHandler from './InputHandler.js';

class GraphNodeCreateInputHandler extends InputHandler
{
  constructor()
  {
    super();
  }

  //Override
  isTargetable(inputController, pointer, target, targetType)
  {
    return targetType === 'none';
  }

  //Override
  onDblAction(inputController, graphController, pointer, target)
  {
    //Create node at position
    graphController.createNode(pointer.x, pointer.y);
    return true;
  }
}

export default GraphNodeCreateInputHandler;
