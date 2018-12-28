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
}

export default AbstractToolbarButton;
