import NodalGraph from 'graph/NodalGraph.js';

import * as FlapSaver from 'util/FlapSaver.js';

const FILETYPE_JSON = "application/json";
const FILETYPE_JFLAP = ".jff";

const JSON_EXT = ".json";
const JFF_EXT = ".jff";
const VALID_EXTS = [JSON_EXT, JFF_EXT];

class Uploader
{
  constructor(graphController)
  {
    this.graphController = graphController;
    this.machineController = null;

    //Add notifications here for errors
  }

  setMachineController(machineController)
  {
    this.machineController = machineController;
  }

  getValidFileTypes()
  {
    return [FILETYPE_JSON, FILETYPE_JFLAP];
  }

  uploadFileGraph(graphFileBlob)
  {
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
          const graph = this.graphController.getGraph();

          this.graphController.emit("userPreImportGraph", graph);

          try
          {
            if (ext === JSON_EXT)
            {
              FlapSaver.loadFromJSON(data, this.graphController, this.machineController);
              //const dataJSON = JSON.parse(data);
              //const dst = NodalGraph.parseJSON(dataJSON);
              //graph.copyGraph(dst);
            }
            else if (ext === JFF_EXT)
            {
              const parser = new DOMParser();
              const dataXML = parser.parseFromString(data, "text/xml");
              const dst = NodalGraph.parseXML(dataXML);
              graph.copyGraph(dst);
            }
            else
            {
              //There is no else... it's just not possible
            }

            this.graphController.emit("userImportGraph", graph);

            if (this.machineController)
            {
              this.machineController.setMachineName(name);
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
            this.graphController.emit("userPostImportGraph", graph);
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
