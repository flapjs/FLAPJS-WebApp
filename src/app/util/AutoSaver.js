import NodalGraph from 'graph/NodalGraph.js';
import { saveConfig } from 'config.js';

const GRAPH_LOCAL_STORAGE_ID = "graph";
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
    const item = localStorage.getItem(GRAPH_LOCAL_STORAGE_ID);
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
    localStorage.removeItem(GRAPH_LOCAL_STORAGE_ID);
  }

  static hasAutoSave()
  {
    return localStorage.getItem(GRAPH_LOCAL_STORAGE_ID) !== null;
  }

  static initAutoSave(graph)
  {
    try
    {
      //start save the workspace per second
      setInterval(() => {
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
          hidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
          visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }

        if (document[hidden])
        {
          //Don't save anything...
          return;
        }

        if (!graph.isEmpty())
        {
          const dst = JSON.stringify(graph.toJSON());
          localStorage.setItem(GRAPH_LOCAL_STORAGE_ID, dst);
        }
        else
        {
          localStorage.removeItem(GRAPH_LOCAL_STORAGE_ID);
        }

        //Save if changes were made
        saveConfig();

      }, AUTOSAVE_INTERVAL);
    }
    catch(e)
    {
      //Ignore any errors! just let it not save.
    }
  }
}

export default AutoSaver;
