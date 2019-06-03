import React from 'react';

const SUBMIT_KEY = "Enter";
const CANCEL_KEY = "Escape";

export const CAPTURE_NONE = "none";
export const CAPTURE_SAVE = "save";
export const CAPTURE_RESET = "reset";

class FormattedInput extends React.Component
{
  constructor(props)
  {
    super(props);

    this.element = null;
    this.ignoreSaveOnExit = false;

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
    //  formatter - a format function
    //  captureOnExit - what to capture on blur (none, save, reset)
    //  defaultValue - the default value for input
    //  multiline - whether to allow multiple lines
  }

  /** @override */
  componentWillReceiveProps(nextProps)
  {
    //Don't overwrite user input...
    if (this.hasFocus()) return;

    //TODO: This is a way to update the value if it is suppose to be the default value...
    if (!this.state.value || this.state.value.length <= 0 || this.state.value === this.props.defaultValue)
    {
      this.setState({value: nextProps.defaultValue});
    }
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
    if (this.ignoreSaveOnExit || this.props.captureOnExit === CAPTURE_NONE)
    {
      //For those you choose to handle exit, it's value should remain correct.
      const result = this.formatValue(e.target.value);
      this.setState({value: result});

      //Don't ignore it for the future.
      this.ignoreSaveOnExit = false;
    }
    else if (this.props.captureOnExit === CAPTURE_SAVE)
    {
      const prev = this.state.prevValue;
      const next = e.target.value || this.props.defaultValue || "";
      this.resetValue(next, () => {
        if (this.props.onSubmit)
        {
          this.props.onSubmit(next, prev);
        }
      });
    }
    else if (this.props.captureOnExit === CAPTURE_RESET)
    {
      this.resetValue(null);
    }
  }

  onKeyUp(e)
  {
    if (e.key === SUBMIT_KEY)
    {
      if (this.props.multiline && e.shiftKey)
      {
        return true;
      }

      const prev = this.state.prevValue;
      const next = e.target.value || this.props.defaultValue || "";
      this.setValue(next, () => {
        this.ignoreSaveOnExit = true;

        if (this.props.onSubmit)
        {
          this.props.onSubmit(next, prev);
        }
        this.element.blur();
      });

      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    else if (e.key === CANCEL_KEY)
    {
      const prev = this.state.prevValue;
      this.resetValue(prev, () => {
        this.ignoreSaveOnExit = true;

        if (this.props.onSubmit)
        {
          this.props.onSubmit(prev || "", prev);
        }
        this.element.blur();
      });

      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  resetValue(newValue=null, callback=null)
  {
    if (newValue !== null)
    {
      const result = this.formatValue(newValue);
      //NOTE: this uses newValue cause formatValue may introduce values
      //which should be saved on exit. Therefore prev and next must be diff.
      this.setState({value: result, prevValue: newValue}, callback);
    }
    else
    {
      this.setState((prev, props) => {
        //NOTE: Although you CAN assume prev is valid, but what about when prev does not exist?
        const result = this.formatValue(prev.prevValue);
        return {value: result};
      }, callback);
    }
  }

  setValue(value, callback)
  {
    if (!value || value.length == 0)
    {
      value = this.props.defaultValue || "";
    }
    else
    {
      value = this.formatValue(value);
    }

    this.setState({value: value}, callback);
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
    const result = formatter ? formatter(value) : value;
    return result || "";
  }

  /** @override */
  render()
  {
    if (this.props.multiline)
    {
      return (
        <textarea
          id={this.props.id} className={this.props.className} style={this.props.style}
          ref={ref=>this.element=ref}
          type="text" value={this.state.value}
          rows="1"
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}>
        </textarea>
      );
    }
    else
    {
      return (
        <input
          id={this.props.id} className={this.props.className} style={this.props.style}
          ref={ref=>this.element=ref}
          type="text" value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}/>
      );
    }
  }
}

export default FormattedInput;
