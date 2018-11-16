import CreateNodeHandler from './CreateNodeHandler.js';

class DblActionEvent
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;

    this.createNodeHandler = new CreateNodeHandler(graphController);
  }

  onEvent(pointer)
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const picker = inputController.getPicker();
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    this.createNodeHandler.onDblActionEvent(pointer, picker);
    return true;
  }
}

export default DblActionEvent;
