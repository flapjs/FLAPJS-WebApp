import AbstractGraphExporter from 'modules/abstract/exporter/AbstractGraphExporter.js';

import JSONIcon from 'icons/flat/JSONIcon.js';

class DefaultGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  //Override
  importFromData(data, module)
  {
    //Do nothing...
  }

  //Override
  exportToData(module)
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
  importFromFile(fileBlob, module)
  {
    return new Promise((resolve, reject) => {
      //Do nothing...
      resolve();
    });
  }

  //Override
  exportToFile(filename, module)
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
  getIconClass()
  {
    return JSONIcon;
  }
}

export default DefaultGraphExporter;
