class InputDownHandler
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;
  }

  onEvent()
  {
    //Make sure to lose focus on label editors
    /*
    if (this.labelEditor.hasFocus())
    {
      this.labelEditor.closeEditor();
      event.result = false;
    }
    */

    const inputController = this.inputController;
    const graphController = this.graphController;
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (picker.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !picker.isTargetInSelection(target))
      {
        picker.clearSelection();
      }
    }

    //Disable all graph input when in step-by-step mode
    if (graphController.tester.getStepByStepMode())
    {
      return true;
    }

    return false;
  }
}

export default InputDownHandler;
