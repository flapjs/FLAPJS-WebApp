import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/App.js';
import NodalGraph from 'graph/NodalGraph.js';

const FRAMES_PER_SECOND = 60;

//Setup viewport
window.addEventListener('load', (event) => {
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Setup application
let prevtime = 0;
let root = null;
let graph = new NodalGraph();

//Load application
function loadApplication()
{
  root = document.getElementById("root");

  //Initial graph setup
  const q0 = graph.newNode(-32, 0, "q0");
  const q1 = graph.newNode(32, 0, "q1");
  graph.newEdge(q0, q1, "0");
}

//Update application
function updateApplication(time)
{
  const dt = (time - prevtime) / FRAMES_PER_SECOND;
  {
    ReactDOM.render(React.createElement(App, { graph: graph }, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
