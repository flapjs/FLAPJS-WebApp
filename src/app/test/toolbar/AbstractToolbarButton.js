class AbstractToolbarButton
{
  constructor()
  {
  }

  getTitle()
  {
    throw new Error("Missing title for button");
  }

  getIconClass()
  {
    throw new Error("Missing icon for button");
  }

  showInToolbar()
  {
    return true;
  }

  showInMenu()
  {
    return true;
  }
}

export default AbstractToolbarButton;
