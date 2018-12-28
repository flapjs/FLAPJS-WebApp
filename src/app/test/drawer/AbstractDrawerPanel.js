class AbstractDrawerPanel
{
  constructor()
  {
  }

  getTitle()
  {
    throw new Error("Missing title for panel");
  }

  getComponentClass()
  {
    return null;
  }
}

export default AbstractDrawerPanel;
