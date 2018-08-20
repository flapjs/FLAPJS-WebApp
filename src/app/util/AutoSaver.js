import NodalGraph from 'graph/NodalGraph.js';

const AUTOSAVE_INTERVAL = 1000; //unit is ms

class AutoSaver
{
  //check if browser support local storage
  static doesSupportLocalStorage()
  {
    return typeof Storage !== 'undefined';
  }

  static loadAutoSave(graph)
  {
    const item = localStorage.getItem('graph');
    if (!item) return;
    try
    {
      const graphJSON = JSON.parse(item);
      const newGraph = NodalGraph.parseJSON(graphJSON);
      graph.copyGraph(newGraph);
    }
    catch (e)
    {
      //Ignore any errors, the graph should remain the same :)
      console.error(e);
    }
  }

  static clearAutoSave()
  {
    localStorage.clear();
  }

  static hasAutoSave()
  {
    return localStorage.getItem('graph') !== null;
  }

  static initAutoSave(graph)
  {
    try
    {
      //start save the workspace per second
      setInterval(() => {
        const dst = JSON.stringify(graph.toJSON());
        localStorage.setItem('graph', dst);
      }, AUTOSAVE_INTERVAL);
    }
    catch(e)
    {
      //Ignore any errors! just let it not save.
    }
  }
}

export default AutoSaver;
