import React from 'react';

class MachineName extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: null
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e)
  {
    this.setState({value: e.target.value});
  }

  onKeyDown(e)
  {
    if (e.key === 'Escape')
    {
      const target = e.target;
      this.setState({value: null}, () => target.blur());
      return false;
    }
    else if (e.key === 'Enter')
    {
      e.target.blur();
      return false;
    }
  }

  onFocus(e)
  {
    this.setState({value: this.props.value});
  }

  onBlur(e)
  {
    if (this.state.value)
    {
      if (this.props.onSubmit) this.props.onSubmit({value: this.state.value});
    }

    this.setState({value: null});
  }

  render()
  {
    return <input type="text"
      className={this.props.className}
      id={this.props.id}
      value={this.state.value != null ? this.state.value : this.props.value}
      onChange={this.onChange}
      onKeyDown={this.onKeyDown}
      onFocus={this.onFocus}
      onBlur={this.onBlur}>
    </input>;
  }
}

export default MachineName;
