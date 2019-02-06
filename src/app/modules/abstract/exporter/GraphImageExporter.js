import AbstractGraphExporter from './AbstractGraphExporter.js';

import PNGIcon from 'icons/flat/PNGIcon.js';
import JPGIcon from 'icons/flat/JPGIcon.js';
import XMLIcon from 'icons/flat/XMLIcon.js';
import SVGIcon from 'icons/flat/SVGIcon.js';
import { FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_SVG, downloadImageFromSVG } from 'util/Downloader.js';

class GraphImageExporter extends AbstractGraphExporter
{
  constructor(imageType=FILE_TYPE_PNG)
  {
    super();
    this._imageType = imageType;
  }

  //Override
  exportToFile(filename, module)
  {
    const workspace = module._workspace;
    const workspaceDim = workspace.ref.viewBox.baseVal;
    const width = workspaceDim.width;
    const height = workspaceDim.height;
    const svg = workspace.getSVGForExport(width, height, module);

    downloadImageFromSVG(filename, this._imageType, svg, width, height);
  }

  //Override
  doesSupportFile()
  {
    return true;
  }

  //Override
  canImport()
  {
    return false;
  }

  //Override
  getTitle()
  {
    switch(this._imageType)
    {
      case FILE_TYPE_PNG: return I18N.toString("file.export.png.hint");
      case FILE_TYPE_JPG: return I18N.toString("file.export.jpg.hint");
      case FILE_TYPE_SVG: return I18N.toString("file.export.svg.hint");
      default: return super.getTitle();
    }
  }

  //Override
  getLabel()
  {
    switch(this._imageType)
    {
      case FILE_TYPE_PNG: return I18N.toString("file.export.png");
      case FILE_TYPE_JPG: return I18N.toString("file.export.jpg");
      case FILE_TYPE_SVG: return I18N.toString("file.export.svg");
      default: return super.getLabel();
    }
  }

  //Override
  getFileType()
  {
    return this._imageType;
  }

  //Override
  getIconClass()
  {
    switch(this._imageType)
    {
      case FILE_TYPE_PNG: return PNGIcon;
      case FILE_TYPE_JPG: return JPGIcon;
      case FILE_TYPE_SVG: return SVGIcon;
      default: return null;
    }
  }
}

export default GraphImageExporter;
