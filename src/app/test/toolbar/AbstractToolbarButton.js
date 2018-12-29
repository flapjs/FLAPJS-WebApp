class AbstractToolbarButton
{
  constructor()
  {
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {}

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
