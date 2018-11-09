import React from 'react';

class FormattedInput extends React.Component
{
  constructor(props)
  {
    super(props);

    this.element = null;

    const defaultValue = props.defaultValue || "";
    this.state = {
      value: defaultValue,
      prevValue: defaultValue
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    //props:
    //  filter - a filter function
    //  saveOnExit - whether to save on blur
    //  defaultValue - the default value for input
  }

  get value()
  {
    return this.state.value;
  }

  focus(replace=false)
  {
    if (replace)
    {
      this.element.select();
    }
    else
    {
      this.element.focus();
    }
  }

  blur()
  {
    this.element.blur();
  }

  hasFocus()
  {
    return this.element === document.activeElement;
  }

  onChange(e)
  {
    if (this.props.filter)
    {
      const result = e.target.value.replace(this.props.filter, '');
      this.setState({value: result});
    }
    else
    {
      this.setState({value: e.target.value});
    }
  }

  onBlur(e)
  {
    if (this.props.saveOnExit)
    {
      this.submitValue(this.state.value);
    }
    else
    {
      this.resetValue(null);
    }
  }

  onKeyUp(e)
  {
    if (e.key == "Enter")
    {
      const prev = this.state.prevValue;
      const next = e.target.value;
      this.submitValue(next, () => {
        if (this.props.onSubmit)
        {
          this.props.onSubmit(next, prev);
        }
        this.element.blur();
      });
      return false;
    }
    else if (e.key == "Escape")
    {
      const prev = this.state.prevValue;
      this.resetValue(prev, () => {
        if (this.props.onSubmit)
        {
          this.props.onSubmit(prev, prev);
        }
        this.element.blur();
      });
      return false;
    }
  }

  submitValue(value, callback)
  {
    if (!value || value.length == 0)
    {
      value = this.props.defaultValue || "";
    }

    const result = this.formatValue(value);
    this.setState({value: result, prevValue: result}, callback);
  }

  resetValue(newValue=null, callback)
  {
    if (newValue != null)
    {
      this.setState({value: newValue, prevValue: newValue}, callback);
    }
    else
    {
      this.setState((prev, props) => {
        return {value: prev.prevValue};
      }, callback);
    }
  }

  appendValue(value, separator=",")
  {
    let result = this.state.value;
    //If the entire input is selected...
    if (this.element.selectionStart == 0 &&
      this.element.selectionEnd == value.length)
    {
      //Replace it!
      result = value;
    }
    //Or just append to the end...
    else
    {
      if (!result || result.length == 0)
      {
        result = value;
      }
      else
      {
        result = result + separator + value;
      }
    }

    //If can filter input...
    if (this.props.filter)
    {
      result = result.replace(this.props.filter, '');
    }

    this.setState({value: this.formatValue(result)});
  }

  formatValue(value)
  {
    const formatter = this.props.formatter;
    const result = formatter(value);
    return result || "";
  }

  //Override
  render()
  {
    return <input
      className={this.props.className} id={this.props.id}
      ref={ref=>this.element=ref}
      type="text" value={this.state.value}
      onChange={this.onChange}
      onBlur={this.onBlur}
      onKeyUp={this.onKeyUp}/>;
  }
}

export default FormattedInput;
