import NodalGraph from 'graph/NodalGraph.js';

const FILETYPE_JSON = "application/json";
const FILETYPE_JFLAP = ".jff";

const JSON_EXT = ".json";
const JFF_EXT = ".jff";

class Uploader
{
  constructor(graph)
  {
    this.graph = graph;
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
      if (ext == JSON_EXT)
      {
        this.uploadJSONGraph(graphFileBlob).then(resolve).catch(reject);
      }
      else if (ext == JFF_EXT)
      {
        this.uploadJFFGraph(graphFileBlob).then(resolve).catch(reject);
      }
      else
      {
        reject("Invalid filename : unknown file extension \'" + ext + "\'");
      }
    });
  }

  uploadJSONGraph(jsonBlob)
  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        try
        {
          const dataJSON = JSON.parse(data);
          const dst = NodalGraph.parseJSON(dataJSON);
          this.graph.copyGraph(dst);

          //Callback will accepts an event object that contains:
          //  file - file data,
          //  name - file name,
          //  graph - the changed graph object
          resolve({
            file: data,
            name: jsonBlob.name.substring(0, jsonBlob.name.lastIndexOf('.')),
            graph: this.graph
          });
        }
        catch(e)
        {
          reader.abort();

          reject(e);
        }
      };
      reader.onerror = (event) => {
        reject(event.target.error.code);
      };
      reader.readAsText(jsonBlob);
    });
  }

  uploadJFFGraph(jffBlob)
  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        try
        {
          let parser = new DOMParser();
          const dataXML = parser.parseFromString(data, "text/xml");
          const dst = NodalGraph.parseXML(dataXML);
          this.graph.copyGraph(dst);

          //Callback will accepts an event object that contains:
          //  file - file data,
          //  name - file name,
          //  graph - the changed graph object
          resolve({
            file: data,
            name: jffBlob.name.substring(0, jffBlob.name.lastIndexOf('.')),
            graph: this.graph
          });
        }
        catch(e)
        {
          reader.abort();

          reject(e);
        }
      };
      reader.onerror = (event) => {
        reject(event.target.error.code);
      };
      reader.readAsText(jffBlob);
    });
  }
}

export default Uploader;
