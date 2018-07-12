import React from 'react';
import ReactDOM from 'react-dom';
import './Workspace.css';

import GraphNode from './graph/GraphNode.js';
import './graph/Graph.css';

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg id="workspace-content"
      viewBox="-150 -150 300 300"
      xmlns="http://www.w3.org/2000/svg">
      <GraphNode radius="16" />
    </svg>;
  }
}

export default Workspace;
