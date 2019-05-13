import React from 'react';
import ReactDOM from 'react-dom';

import FSANodeRenderer from '../../../renderer/FSANodeRenderer.js';
import FSAEdgeRenderer from '../../../renderer/FSAEdgeRenderer.js';
import NodeRenderer from '../../../../../graph2/renderer/NodeRenderer.js';
import StringTester from '../../../tester/StringTester.js';

class FSACompTree extends React.Component
{
  constructor(props) 
  {
    super(props);
    this._window = null;
    this._tester = new StringTester();
    this._tester.startTest(this.props.testStr, props.graphController, props.machineController);
    this.nextStep = this.nextStep.bind(this);

    this.state = { containerTree: null };
  }

  componentDidMount() 
  {
    this._window = window.open('', '', 'width=600,height=400,left=200,top=200');
    const containerTree = document.createElement('div');
    this._window.document.body.appendChild(containerTree);
    this._window.document.title = 'FA Computation Tree';

    this._window.addEventListener('beforeunload', () => {
      this.props.closeTreeWindow();
    });

    this.setState({ containerTree: containerTree })
  }

  componentWillUnmount()
  {
    this._window.close();
  }

  nextStep()
  {
    // console.log(this._tester.targets);
    this._tester.stepForward(this.props.graphController, this.props.machineController);
  }

  render()
  {
    if (!this.state.containerTree) return null;

    const nextStep = this.nextStep;
    console.log(this._tester.targets);
    return ReactDOM.createPortal(
      <div>
        {this._tester.targets.length > 0 &&
          this._tester.targets.map(
            (e, i) => <svg key={e.getGraphElementID() || i}>
              <React.Fragment>
                <NodeRenderer
                  position={e}
                  radius={e.getNodeSize()}
                  label={e.getNodeLabel()} />
              </React.Fragment>
            </svg>
          )
        }
        <button onClick={nextStep}>next step</button>
      </div>
      , this._window.document.body);
  }

}

export default FSACompTree;
// need to make a function that calculates where the nodes should be and shit lmao
// also probably need to add another array that keeps track of the older nodes