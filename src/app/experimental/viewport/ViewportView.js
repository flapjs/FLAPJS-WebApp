import React from 'react';
import Style from './ViewportView.css';

const VIEWPORT_DEFAULT_VIEW_INDEX = 0;

class ViewportView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;

    this.state = {
      viewIndex: VIEWPORT_DEFAULT_VIEW_INDEX
    };
  }

  setCurrentView(viewIndex)
  {
    if (!this.props.views) return;
    if (viewIndex >= this.props.views.length) viewIndex = VIEWPORT_DEFAULT_VIEW_INDEX;

    //Open and set tab index
    this.setState({viewIndex: viewIndex});
  }

  getCurrentViewIndex()
  {
    return this.state.viewIndex;
  }

  isCurrentView(viewIndex)
  {
    return this.state.viewIndex === viewIndex;
  }

  //Override
  render()
  {
    const viewportViews = this.props.views;
    const viewportViewIndex = this.state.viewIndex;
    const ViewportViewPane = viewportViewIndex >= 0 ? viewportViews[viewportViewIndex] : null;

    return (
      <div ref={ref=>this.ref=ref}
        id={this.props.id}
        className={Style.view_container +
          " " + this.props.className}
        style={this.props.style}>
        {ViewportViewPane &&
          <ViewportViewPane {...this.props.viewProps} viewport={this}/>}
      </div>
    );
  }
}

export default ViewportView;
