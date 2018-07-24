import React from 'react';

import '../Panel.css';
import './OverviewPanel.css';

class OverviewPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="overview">
      <div className="panel-title">
        <h1>Definition</h1>
      </div>
      <div className="panel-content">
        <GraphDefinition />
      </div>
      <hr />
      <button className="panel-button">Convert To NFA</button>
      <div>
        <input type="checkbox"/>
        <label>Auto-Layout</label>
      </div>
    </div>;
  }
}

class GraphDefinition extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className="graphinfo">
      <div className="statblock">
        <label>Q :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="states">
            q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
        <div className="statblock">
          <label>&Sigma; :</label>
          <div className="statset">
          <span className="statset-open">{"{"}</span>
            <div className="statlist" id="symbols">
              0, 1, a, b, c, d, e, f, g, h, i
            </div>
          <span className="statset-close">{"}"}</span>
          </div>
        </div>
      <div className="statblock">
        <label>&delta; :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="transitions">
            <li>(q0, 0) &rarr; q2,</li>
            <li>(q1, 0) &rarr; q1,</li>
            <li>(q2, 0) &rarr; q0</li>
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
      <div className="statblock">
        <label>q<sub>0</sub> :</label>
        <div className="statlist" id="startState">
          q0
        </div>
      </div>
      <div className="statblock">
        <label>F :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="finalStates">
            q0, q1
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
    </div>;
  }
}


export default OverviewPanel;
