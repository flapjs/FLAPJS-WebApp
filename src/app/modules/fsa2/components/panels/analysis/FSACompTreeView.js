import React from 'react';

import FSACompTree from './FSACompTree.js';
import Style from './AnalysisPanel.css';

class FSACompTreeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTree: false
    }

    this.toggleTree = this.toggleTree.bind(this);
    this.closeTreeWindow = this.closeTreeWindow.bind(this);
  }

  toggleTree() {
    this.setState(state => ({
      activeTree: !state.activeTree,
    }));
  }

  closeTreeWindow() {
    this.setState({ activeTree: false })
  }

  render() {
    return (
      <div>
        <button className={Style.analysis_button} onClick={this.toggleTree}>
          {this.state.activeTree ? 'Close' : 'Generate'} Tree
          </button>
        {
          this.state.activeTree && (
            <FSACompTree closeTreeWindow={this.closeTreeWindow} testStr="ab"
              machineController={this.props.machineController}
              graphController={this.props.graphController} />
          )
        }
    </div>
    );
  }

}

export default FSACompTreeView;