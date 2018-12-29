import React from 'react';
import './IconButton.css';

class IconStateButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      index: props.initial || 0
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const prevIndex = this.state.index;
    this.setState((prev, props) => {
      const count = React.Children.count(props.children);
      let nextIndex = prev.index + 1;
      if (nextIndex >= count)
      {
        nextIndex = 0;
      }
      return {index: nextIndex};
    }, () => {
      if (this.props.onClick)
      {
        this.props.onClick(e, prevIndex);
      }
    });
  }

  setStateIndex(index)
  {
    this.setState({index: index});
  }

  getStateIndex()
  {
    return this.state.index;
  }

  //Override
  render()
  {
    return (
      <button id={this.props.id}
        className={"icon-button " + this.props.className}
        style={this.props.style}
        title={this.props.title}
        disabled={this.props.disabled}
        onClick={this.onClick}>
        {React.Children.map(this.props.children, (child, i) => {
          if (i === this.state.index) return child;
          return null;
        })}
      </button>
    );
  }
}
export default IconStateButton;
