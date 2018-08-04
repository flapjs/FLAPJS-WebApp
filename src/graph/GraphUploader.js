import NodalGraph from './NodalGraph.js';

class GraphUploader
{
  static uploadFileToGraph(fileBlob, graph, callback=null, errorCallback=null)
  {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      try
      {
        const dataJSON = JSON.parse(data);
        const dst = NodalGraph.parseJSON(dataJSON);
        graph.copyGraph(dst);

        //Callback will accepts an event object that contains:
        //  file - file data,
        //  name - file name,
        //  graph - the changed graph object
        if (callback) callback({
          file: data,
          name: fileBlob.name.substring(0, fileBlob.name.lastIndexOf('.')),
          graph: graph
        });
      }
      catch(e)
      {
        reader.abort();

        if (errorCallback) errorCallback(e);
      }
    };
    reader.onerror = (event) => {
      if (errorCallback) errorCallback(event.target.error.code);
    };
    reader.readAsText(fileBlob);
  }

  static uploadJFFToGraph(fileBlob, graph, callback=null, errorCallback=null)
  {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      try
      {
        let parser = new DOMParser();
        const dataXML = parser.parseFromString(data, "text/xml");
        const dst = NodalGraph.parseXML(dataXML);

        graph.copyGraph(dst);

        //Callback will accepts an event object that contains:
        //  file - file data,
        //  name - file name,
        //  graph - the changed graph object
        if (callback) callback({
          file: data,
          name: fileBlob.name.substring(0, fileBlob.name.lastIndexOf('.')),
          graph: graph
        });
      }
      catch(e)
      {
        console.log(e);
        reader.abort();

        if (errorCallback) errorCallback();
      }
    };
    reader.onerror = (event) => {
      if (errorCallback) errorCallback(event.target.error.code);
    };
    reader.readAsText(fileBlob);
  }
}

export default GraphUploader;
