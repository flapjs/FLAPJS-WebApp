import * as FlapSaver from 'util/FlapSaver.js';

const FILETYPE_JSON = "application/json";
const FILETYPE_JFLAP = ".jff";
const FILETYPE_XML = ".xml";
const VALID_FILETYPES = [FILETYPE_JSON, FILETYPE_JFLAP, FILETYPE_XML];

const JSON_EXT = ".json";
const JFF_EXT = ".jff";
const XML_EXT = ".xml";
const VALID_EXTS = [JSON_EXT, JFF_EXT, XML_EXT];

class Uploader
{
  constructor(graphController)
  {
    this.app = null;
    this.graphController = graphController;
    this.machineController = null;

    //Add notifications here for errors
  }

  setApp(app)
  {
    this.app = app;
  }

  setMachineController(machineController)
  {
    this.machineController = machineController;
  }

  getValidFileTypes()
  {
    return VALID_FILETYPES;
  }

  uploadFileGraph(graphFileBlob)
  {
    const app = this.app;
    const graphController = this.graphController;
    const machineController = this.machineController;
    return new Promise((resolve, reject) => {
      if (!graphFileBlob) reject("Invalid file data : null");

      const name = graphFileBlob.name;
      const i = name.lastIndexOf('.');
      if (i < 0) reject("Invalid filename : missing file extension");

      const ext = name.substring(i);

      if (VALID_EXTS.includes(ext))
      {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target.result;
          const name = graphFileBlob.name.substring(0, graphFileBlob.name.lastIndexOf('.'));
          const graph = graphController.getGraph();

          graphController.emit("userPreImportGraph", graph);

          try
          {
            if (ext === JSON_EXT)
            {
              const jsonData = JSON.parse(data);
              FlapSaver.loadFromJSON(jsonData, app.getCurrentModule().getGraphParser().JSON, graphController, machineController);
            }
            else if (ext === JFF_EXT || ext === XML_EXT)
            {
              const xmlData = new DOMParser().parseFromString(data, "text/xml");
              app.getCurrentModule().getGraphParser().XML.parse(xmlData, graph);
            }
            else
            {
              //There is none else... it's just not possible
            }

            graphController.emit("userImportGraph", graph);

            if (machineController)
            {
              machineController.setMachineName(name);
            }

            //Callback will accepts an event object that contains:
            //  file - file data,
            //  name - file name,
            //  graph - the changed graph object
            resolve({
              file: data,
              name: name,
              graph: graph
            });
          }
          catch(e)
          {
            reader.abort();

            reject(e);
          }
          finally
          {
            graphController.emit("userPostImportGraph", graph);
          }
        };
        reader.onerror = (event) => {
          reject(event.target.error.code);
        };
        reader.readAsText(graphFileBlob);
      }
      else
      {
        reject("Invalid filename : unknown file extension \'" + ext + "\'");
      }
    });
  }
}

export default Uploader;
