import AbstractToolbarButton from './toolbar/AbstractToolbarButton.js';
import DownloadIcon from 'test/iconset/DownloadIcon.js';

class ExportToolbarButton extends AbstractToolbarButton
{
  constructor()
  {
    super();
  }

  //Override
  getTitle()
  {
    return "Export";
  }

  //Override
  getIconClass()
  {
    return DownloadIcon;
  }
}
export default ExportToolbarButton;
