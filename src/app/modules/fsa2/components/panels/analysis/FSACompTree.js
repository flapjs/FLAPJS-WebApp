import React from 'react';
import ReactDOM from 'react-dom';

import NodeRenderer from '../../../../../graph2/renderer/NodeRenderer.js';
import EdgeRenderer from '../../../../../graph2/renderer/EdgeRenderer.js';
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
    this._nodeSVGs = {};
    this._tester = new StringTester();
    this._tester.startTest(this.props.testStr, props.graphController, props.machineController);

    this.nextStep = this.nextStep.bind(this);
    this.backStep = this.backStep.bind(this);
    this.nodeMapping = this.nodeMapping.bind(this);
    this.setupEdges = this.setupEdges.bind(this);
    this.refCallback = this.refCallback.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.setupEdges();

    this.state = { containerTree: null };
  }

  setupEdges()
  {
    // initializes an empty array for each node's outgoing edges
    this.props.graphController.getGraph().getNodes().map(
      (e) => {
        this._edges[e.getGraphElementID()] = []
      }
    );
      
    // console.log("setting up edges");
    this.props.graphController.getGraph().getEdges().map(
      (e) => {
        this._edges[e.getEdgeFrom().getGraphElementID()].push(e)
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
    styling += '.custom_svg {\n\tdisplay: block;\n}\n';
    styling += '.edges_svg {\n \
    position: absolute;\n \
    top: 0;\n \
    left: 0;\n \
    z-index: -1;\n}\n';

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

    this._window.addEventListener("resize", this.updateDimensions);
    this.setState({ containerTree: containerTree });
  }

  componentWillUnmount()
  {
    this._window.removeEventListener("resize", this.updateDimensions);
    this._window.close();
  }

  updateDimensions()
  {
    console.log("Updating")
    this.setState({ containerTree: this.state.containerTree })
  }
  
  refCallback(e)
  {
    if (e)
    {
      console.log("possibly updating");
      this._nodeSVGs[e.id] = e.getBoundingClientRect();
    }
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
      <svg key={`${e.getGraphElementID()}-${id}`} id={`${e.getGraphElementID()}-${id}`} 
        width='40' height='40' className="custom_svg" ref={this.refCallback}>
        <React.Fragment>
          <NodeRenderer
            position={pos}
            radius={e.getNodeSize()}
            label={e.getNodeLabel()} />
        </React.Fragment>
      </svg>
    );
  }

  edgeMapping(e, index)
  {
    if (index >= this._nodes.length-2) return;
    // console.log(e, index, this._nodes.length);

    if(e.getEdgeLabel().includes(this.props.testStr.charAt(index)))
    {
      // console.log(e);
      // console.log(e.getEdgeFrom());
      // console.log(e.getEdgeFrom().getGraphElementID(), index);
      // console.log(e.getEdgeTo());
      // console.log(e.getEdgeTo().getGraphElementID(), index);

      // console.log(this._nodeSVGs);

      const start = {
        x: this._nodeSVGs[`${e.getEdgeFrom().getGraphElementID()}-${index}`].x + 20,
        y: this._nodeSVGs[`${e.getEdgeFrom().getGraphElementID()}-${index}`].y + 20,
      };
      
      const end = {
        x: this._nodeSVGs[`${e.getEdgeTo().getGraphElementID()}-${index+1}`].x + 20,
        y: this._nodeSVGs[`${e.getEdgeTo().getGraphElementID()}-${index+1}`].y + 20
      };

      const center = {
        x: start.x + (end.x - start.x) / 2,
        y: start.y + (end.y - start.y) / 2
      };

      return (
        <React.Fragment>
          <EdgeRenderer
            from={start}
            to={end}
            center={center}
            label={this.props.testStr.charAt(index)} />
        </React.Fragment>
      );
    }
    
    return;
  }

  render()
  {
    if (!this.state.containerTree) return null;

    //console.log("nodeSVGS", this._nodeSVGs);
    return ReactDOM.createPortal(
      <div>
        {this._nodes.length > 0 &&
          this._nodes.map((e, i) =>
            <div className="flex_container" key={i}>
              {e.map((f, j) =>
                this.nodeMapping(f, i)
              )}
            </div>
          )
        }
        <svg className="edges_svg" width='600' height='400'>
          {this._nodes.map((e, i) =>
              e.map((f) =>
                this._edges[f.getGraphElementID()].map((g) =>
                  this.edgeMapping(g, i)
                )
              )
            )
          }
        </svg>
        <button onClick={this.nextStep}>next step</button>
        <button onClick={this.backStep}>back step</button>
      </div>
      , this._window.document.body);
  }

}

export default FSACompTree;