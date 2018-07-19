import NodalGraph from 'graph/NodalGraph.js';

const TIMEPERSAVE = 1000 //unit is ms

//check if browser support local storage
export function supportLocalStorage(){
    return typeof(Storage)!== 'undefined';
}


export function initAutosave(graph){
  try{
    //start save the workspace per second
    setInterval(function(){
      const dst = JSON.stringify(graph.toJSON());
      localStorage.setItem('graph', dst);
    },TIMEPERSAVE);
  }
  catch(e){
    throw e;
  }
}

//retrieve the graph when reload
export function restoreGraph(graph){
  const json = localStorage.getItem('graph');
  if (!json) return;
  try {
    const graphJSON = JSON.parse(json);
    const newGraph = NodalGraph.parseJSON(graphJSON);
    graph.copyGraph(newGraph);
  } catch (e) {
    //Ignore any errors, the graph should remain the same :)
  }
}
