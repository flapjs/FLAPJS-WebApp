import React from 'react';
import ReactDOM from 'react-dom';

import NodalGraph from 'graph/NodalGraph.js';
import GraphInputController from 'controller/GraphInputController.js';

import HomePage from 'pages/home/HomePage.js';
import App from 'pages/content/App.js';
import Page404 from 'pages/Page404.js';

const PAGES = {
  '/': HomePage,
  '/app': App
};
const ROUTER = {
  pathname: "/"
};

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

//Must be initialized (will be called in Workspace.componentDidMount)
let controller = new GraphInputController(graph);

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
    const PageHandler = PAGES[ROUTER.pathname] || Page404;
    ReactDOM.render(React.createElement(PageHandler, { router: ROUTER, graph: graph, controller: controller }, null), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
