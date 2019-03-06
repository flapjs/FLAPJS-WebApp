import AbstractGraphExporter from 'manager/export/AbstractGraphExporter.js';

import { downloadText } from 'util/Downloader.js';

import JSONFileIcon from 'experimental/iconset/flat/JSONFileIcon.js';

class REGraphExporter extends AbstractGraphExporter
{
  constructor() { super(); }

  fromJSON(data, module)
  {
    const machineController = module.getMachineController();

    const metadata = '_metadata' in data ? data['_metadata'] : {};

    //HACK: this should be calculated elsewhere
    const machineData = data.machineData;
    const machineName = machineData.name;
    if (machineName) module.getApp().getSession().setProjectName(machineName);
    const machineExpression = machineData.expression;
    if (machineExpression) machineController.setMachineExpression(machineExpression);

    return machineExpression;
  }

  toJSON(expression, module)
  {
    const machineController = module.getMachineController();

    const dst = {};
    dst["_metadata"] = {
      module: module.getModuleName(),
      version: process.env.VERSION + ":" + module.getModuleVersion(),
      timestamp: new Date().toString()
    };
    dst["machineData"] = {
      name: module.getApp().getSession().getProjectName(),
      expression: machineController.getMachineExpression()
    };
    return dst;
  }

  //Override
  importFromData(data, module)
  {
    this.fromJSON(data, module);
  }

  //Override
  exportToData(module)
  {
    const expression = module.getMachineController().getMachineExpression();
    const result = this.toJSON(expression, module);
    return result;
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
      const filename = fileBlob.name;
      if (!filename.endsWith(this.getFileType()))
      {
        throw new Error("Trying to import invalid file type for \'" + this.getFileType() + "\': " + filename);
      }

      const reader = new FileReader();
      reader.onload = e => {
        const machineController = module.getMachineController();
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const expression = machineController.getMachineExpression();

        //TODO: this should not be here, this should exist somewhere in graphController
        if (expression.length > 0)
        {
          module.getApp().getUndoManager().captureEvent();
        }

        try
        {
          const jsonData = JSON.parse(data);

          this.fromJSON(jsonData, module);

          module.getApp().getSession().setProjectName(name);

          resolve();
        }
        catch (e)
        {
          reader.abort();
          reject(e);
        }
        finally
        {
          const nextExpression = machineController.getMachineExpression()
          if (expression !== nextExpression)
          {
            module.getApp().getUndoManager().captureEvent();
          }
        }
      };

      reader.onerror = e => {
        reject(new Error("Unable to import file: " + e.target.error.code));
      }

      reader.readAsText(fileBlob);
    });
  }

  //Override
  exportToFile(filename, module)
  {
    const expression = module.getMachineController().getMachineExpression();
    const dst = this.toJSON(expression, module);
    const jsonString = JSON.stringify(dst);
    downloadText(filename + '.' + this.getFileType(), jsonString);
  }

  //Override
  doesSupportFile()
  {
    return true;
  }

  //Override
  canImport(module)
  {
    return true;
  }

  //Override
  canExport(module)
  {
    return module.getMachineController().getMachineExpression().length > 0;
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
    return JSONFileIcon;
  }
}

export default REGraphExporter;
