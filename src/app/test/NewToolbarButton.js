import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';

import Icon from 'test/Icon.js';

class NewToolbarButton extends AbstractToolbarButton
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "New";
  }

  //Override
  getIconClass()
  {
    return Icon;
  }
}

export default NewToolbarButton;
