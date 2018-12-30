import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';
import UploadIcon from 'test/iconset/UploadIcon.js';

class UploadToolbarButton extends AbstractToolbarButton
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "Upload";
  }

  //Override
  getIconClass()
  {
    return UploadIcon;
  }
}
export default UploadToolbarButton;
