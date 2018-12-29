class AbstractDrawerPanel
{
  constructor()
  {
    this.panelComponent = null;
  }

  getPanelComponent()
  {
    return this.panelComponent;
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
