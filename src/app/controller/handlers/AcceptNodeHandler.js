class AcceptNodeHandler
{
  constructor(controller)
  {
    this.controller = controller;
  }

  onActionEvent(pointer, picker)
  {
    const controller = this.controller;
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (targetType === 'node')
    {
      controller.toggleNode(target);
      return true;
    }

    return false;
  }
}

export default AcceptNodeHandler;
