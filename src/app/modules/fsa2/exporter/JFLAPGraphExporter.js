import AbstractGraphExporter from 'session/manager/export/AbstractGraphExporter.js';

import XMLFileIcon from 'experimental/iconset/flat/XMLFileIcon.js';
import { XML as XMLGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';
import { downloadText } from 'util/Downloader.js';

/**
 * @class JFLAPGraphExporter
 * class responsible for exporting/importing to/from JFLAP
 */
class JFLAPGraphExporter extends AbstractGraphExporter
{
  /**
   * @constructor
   *  Invokes the superconstructor for the AbstractGraphExporter
   */
  constructor() { super(); }


  /**
   *   function imports jff into a module
   * @param {file} fileObj - the file that is being read from
   * @param {module} module - the associated module
   *
   */
  //override
  importFromFile(fileObj, module)
  {
    return new Promise((resolve, reject) => {
      const filename = fileObj.name;
      if (!filename.endsWith(this.getFileType()))
      {
        throw new Error("Trying to import invalid file type for \'" + this.getFileType() + "\': " + filename);
        //TODO Add logging for errors rather than simply printing to standard error
      }

      const reader = new FileReader();
      // TODO: change variable e to something more descriptive
      reader.onload = e => {
        const graphController = module.getGraphController();
        const machineController = module.getMachineController();
        const data = e.target.result;
        const name = filename.substring(0, filename.length - this.getFileType().length - 1);
        const graph = graphController.getGraph();

        //TODO: this should not be here, this should exist somewhere in graphController
        // ^^ what does this mean?
        module.getApp().getUndoManager().captureEvent();

        try
        {
          const xmlData = new DOMParser().parseFromString(data, "text/xml");
          XMLGraphParser.parse(xmlData, graph);

          //graphController.emit("userImportGraph", graph);

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
          //TODO: this should not be here, this should exist somewhere in graphController
          // ^^ what does this mean? (Added from duplicate call hihger up)
          module.getApp().getUndoManager().captureEvent();
        }
      };

      reader.onerror = e => {
        //TODO: this should not be here, this should exist somewhere in graphController
        // ^^ is this still necessary?
        reject(new Error("Unable to import file: " + e.target.error.code));
      }

      reader.readAsText(fileObj);
    });
  }

  /**
   * exports graph belonging to module to a .jff file
   * @param {string} filename - name of file to exportToFile
   * @param {module} modules  - name of module
   */
  //Override
  exportToFile(filename, module)
  {
    const graph = module.getGraphController().getGraph();
    const graphData = XMLGraphParser.objectify(graph);
    const xmlString = new XMLSerializer().serializeToString(graphData);
    downloadText(filename + '.' + this.getFileType(), xmlString);
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
  getTitle()
  {
    return I18N.toString("file.export.jff.hint");
  }

  //Override
  getLabel()
  {
    return I18N.toString("file.export.jff");
  }

  //Override
  getFileType()
  {
    return "jff";
  }

  //Override
  getIconClass()
  {
    return XMLFileIcon;
  }
}

export default JFLAPGraphExporter;
