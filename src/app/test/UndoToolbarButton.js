import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';
import UndoIcon from 'test/iconset/UndoIcon.js';

class UndoToolbarButton extends AbstractToolbarButton
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "Undo";
  }

  //Override
  getIconClass()
  {
    return UndoIcon;
  }

  //Override
  showInMenu()
  {
    return false;
  }
}
export default UndoToolbarButton;
