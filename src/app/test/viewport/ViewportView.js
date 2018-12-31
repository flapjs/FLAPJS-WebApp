import React from 'react';

class ViewportView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      index: 0
    };
  }

  setViewIndex(index)
  {
    this.setState({index: index});
  }

  getViewIndex()
  {
    return this.state.index;
  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={this.props.className}
        style={this.props.style}>
        {React.Children.map(this.props.children, (child, i) => {
          if (this.state.index === i)
          {
            return React.cloneElement(child, {active: true});
          }
          else
          {
            return child;
          }
        })}
      </div>
    );
  }
}

export default ViewportView;
