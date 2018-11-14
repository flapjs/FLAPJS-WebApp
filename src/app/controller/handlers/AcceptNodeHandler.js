class AcceptNodeHandler
{
  constructor(controller)
  {
    this.controller = controller;
  }

  onActionEvent(pointer)
  {
    const controller = this.controller;
    const x = pointer.x;
    const y = pointer.y;
    const target = pointer.getPicker().initialTarget;
    const targetType = pointer.getPicker().initialTargetType;

    if (targetType === 'node')
    {
      controller.toggleNode(target);
      return true;
    }

    return false;
  }
}

export default AcceptNodeHandler;
