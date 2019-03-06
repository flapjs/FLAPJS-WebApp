import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';

class ExpressionView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.view_widget} style={{top: "50%", left: "50%"}}>
          <input/>
        </div>
      </div>
    );
  }
}

export default ExpressionView;
