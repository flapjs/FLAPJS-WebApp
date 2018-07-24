import NodalGraph from './NodalGraph.js';

class GraphUploader
{
  static uploadFileToGraph(fileBlob, graph, callback)
  {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const dst = NodalGraph.parseJSON(JSON.parse(data));
      graph.copyGraph(dst);

      if (callback) callback();
    };
    reader.onerror = (event) => {
      console.error("File could not be read! Code " + event.target.error.code);
    };
    reader.readAsText(fileBlob);
  }
}

export default GraphUploader;
