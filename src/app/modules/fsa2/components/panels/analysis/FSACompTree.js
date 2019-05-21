import React from 'react';
import ReactDOM from 'react-dom';

import NodeRenderer from '../../../../../graph2/renderer/NodeRenderer.js';
import StringTester from '../../../tester/StringTester.js';
import Style from './FSACompTree.css';

class FSACompTree extends React.Component
{
  constructor(props) 
  {
    super(props);
    this._window = null;
    this._nodes = [];
    this._edges = {};
    this._tester = new StringTester();
    this._tester.startTest(this.props.testStr, props.graphController, props.machineController);
    
    this.nextStep = this.nextStep.bind(this);
    this.backStep = this.backStep.bind(this);
    this.nodeMapping = this.nodeMapping.bind(this);
    this.setupEdges = this.setupEdges.bind(this);

    this.setupEdges();

    this.state = { containerTree: null };
  }

  setupEdges() {

    // initializes an empty array for each node's outgoing edges
    this.props.graphController.getGraph().getNodes().map(
      (e) => this._edges[e.getNodeLabel()] = []
    );


    this.props.graphController.getGraph().getEdges().map(
      (e) =>  {
        this._edges[e.getEdgeFrom().getNodeLabel()].push(e)
        console.log(e.getEdgeFrom().getNodeLabel());
      }
    );

  }

  componentDidMount() 
  {
    this._window = window.open('', '', 'width=600,height=400,left=200,top=200');
    const containerTree = document.createElement('div');
    this._window.document.body.appendChild(containerTree);
    this._window.document.title = 'FSA Computation Tree';

    const cssNode = document.createElement('style');
    cssNode.setAttribute('type', 'text/css');

    // TODO: must refactor
    let styling = '.flex_container {\n \
    height: 20%;\n \
    display: flex;\n \
    justify-content: center;\n \
    align-items: center;\n}\n';
    styling += '.custom_svg {\n\tdisplay: block;\n}';
    
    if (cssNode.styleSheet)
    {
      cssNode.styleSheet.cssText = styling;
    }
    else
    {
      cssNode.appendChild(document.createTextNode(styling));
    }

    this._window.document.head.appendChild(cssNode);

    this._window.addEventListener('beforeunload', () =>
    {
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
    // adds nodes that we're using to render
    this._tester.stepForward(this.props.graphController, this.props.machineController);
    if(this._tester.targets.length > 0)
    {
      this._nodes.push(this._tester.targets);
    }

  }

  backStep()
  {
    // doesn't do anything since string tester hasn't been implemented with this yet
    this._tester.stepBackward(this.props.graphController, this.props.machineController);
    if(this._nodes.length > 0)
    {
      this._nodes.pop();
    }
  }

  nodeMapping(e, id)
  {
    let pos = {
      x: 18,
      y: 18
    };

    return (
      <svg key={e.getGraphElementID() || id} width='40' height='40' className="custom_svg">
        <React.Fragment>
          <NodeRenderer
            position={pos}
            radius={e.getNodeSize()}
            label={e.getNodeLabel()} />
        </React.Fragment>
      </svg>
    );
  }

  edgeMapping(e, id)
  {
    
  }

  render()
  {
    if (!this.state.containerTree) return null;

    return ReactDOM.createPortal(
      <div>
        {this._nodes.length > 0 &&
          this._nodes.map((e, i) =>
            <div className="flex_container" key={i}>
              {e.map((f, j) =>
                this.nodeMapping(f, j)
              )}
            </div>
          )
        }
        <button onClick={this.nextStep}>next step</button>
        <button onClick={this.backStep}>back step</button>
      </div>
      , this._window.document.body);
  }

}

export default FSACompTree;