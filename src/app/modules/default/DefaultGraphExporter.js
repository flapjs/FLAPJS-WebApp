import AbstractGraphExporter from 'modules/base/exporter/AbstractGraphExporter.js';

import JSONIcon from 'icons/flat/JSONIcon.js';

class DefaultGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  //Override
  importFromData(data, app)
  {
    //Do nothing...
  }

  //Override
  exportToData(app)
  {
    //Return nothing...
    return {};
  }

  //Override
  doesSupportData()
  {
    return true;
  }

  //Override
  importFromFile(fileBlob, app)
  {
    return new Promise((resolve, reject) => {
      //Do nothing...
      resolve();
    });
  }

  //Override
  exportToFile(filename, app)
  {
    //Do nothing...
  }

  //Override
  doesSupportFile()
  {
    return true;
  }

  //Override
  canImport()
  {
    return true;
  }

  //Override
  getTitle()
  {
    return I18N.toString("file.export.machine.hint");
  }

  //Override
  getLabel()
  {
    return I18N.toString("file.export.machine");
  }

  //Override
  getFileType()
  {
    return "json";
  }

  //Override
  getIconComponentClass()
  {
    return JSONIcon;
  }
}

export default DefaultGraphExporter;
