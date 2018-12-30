import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';
import PageEmptyIcon from 'test/iconset/PageEmptyIcon.js';

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
    return PageEmptyIcon;
  }
}
export default NewToolbarButton;
