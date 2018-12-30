import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';
import RedoIcon from 'test/iconset/RedoIcon.js';

class RedoToolbarButton extends AbstractToolbarButton
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "Redo";
  }

  //Override
  getIconClass()
  {
    return RedoIcon;
  }

  //Override
  showInMenu()
  {
    return false;
  }
}
export default RedoToolbarButton;
