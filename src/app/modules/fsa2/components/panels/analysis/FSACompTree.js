import React from 'react';
import ReactDOM from 'react-dom';

import FSANodeRenderer from '../../../renderer/FSANodeRenderer.js';
import FSAEdgeRenderer from '../../../renderer/FSAEdgeRenderer.js';
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
    return ReactDOM.createPortal(
      <div>
        {this._tester.targets.length > 0 &&
          this._tester.targets.map((e) => <svg key={e.getGraphElementID()} xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24"><FSANodeRenderer node={e} /></svg>)
        }
        <button onClick={nextStep}>next step bruh</button>
      </div>
      , this._window.document.body);
  }

}

export default FSACompTree;