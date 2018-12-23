import AbstractGraphExporter from 'modules/base/exporter/AbstractGraphExporter.js';

import PNGIcon from 'icons/flat/PNGIcon.js';
import JPGIcon from 'icons/flat/JPGIcon.js';
import Downloader from 'util/Downloader.js';

class FSAImageExporter extends AbstractGraphExporter
{
  constructor(imageType='png')
  {
    super();
    this._imageType = imageType;
  }

  //Override
  exportToFile(filename, app)
  {
    const workspace = app.workspace;
    const workspaceDim = workspace.ref.viewBox.baseVal;
    const width = workspaceDim.width;
    const height = workspaceDim.height;
    const svg = workspace.getSVGForExport(width, height);

    Downloader.downloadSVG(filename, this._imageType, svg, width, height);
  }

  //Override
  doesSupportFile()
  {
    return true;
  }

  //Override
  getTitle()
  {
    switch(this._imageType)
    {
      case 'png': return I18N.toString("file.export.png.hint");
      case 'jpg': return I18N.toString("file.export.jpg.hint");
      default: return super.getTitle();
    }
  }

  //Override
  getLabel()
  {
    switch(this._imageType)
    {
      case 'png': return I18N.toString("file.export.png");
      case 'jpg': return I18N.toString("file.export.jpg");
      default: return super.getLabel();
    }
  }

  //Override
  getFileType()
  {
    return this._imageType;
  }

  //Override
  getIconComponentClass()
  {
    switch(this._imageType)
    {
      case 'png': return PNGIcon;
      case 'jpg': return JPGIcon;
      default: return null;
    }
  }
}

export default FSAImageExporter;
