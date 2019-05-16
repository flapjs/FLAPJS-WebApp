import React from 'react';
import Style from './TestItem.css';

import IconButton from 'experimental/components/IconButton.js';
import SubtractIcon from 'components/iconset/SubtractIcon.js';
import CheckCircleIcon from 'components/iconset/CheckCircleIcon.js';
import CrossCircleIcon from 'components/iconset/CrossCircleIcon.js';
import PendingIcon from 'components/iconset/PendingIcon.js';
import RunningManIcon from 'components/iconset/RunningManIcon.js';

export const DEFAULT_MODE = 'default';
export const SUCCESS_MODE = 'success';
export const FAILURE_MODE = 'failure';
export const WORKING_MODE = 'working';

class TestItem extends React.Component
{
    constructor(props)
    {
        super(props);

        this.inputElement = null;

        this.state = {
            value: this.props.defaultValue || '',
            status: DEFAULT_MODE
        };

        this.onChange = this.onChange.bind(this);
    }

    focus()
    {
        if (this.inputElement)
        {
            this.inputElement.focus();
        }
    }

    setValue(value, callback=null)
    {
        if (this.state.value !== value)
        {
            this.setState({value: value}, callback);
        }
        else if (callback)
        {
            callback();
        }
    }

    setStatus(status, callback=null)
    {
        if (this.state.status !== status)
        {
            this.setState({status: status}, callback);
        }
        else if (callback)
        {
            callback();
        }
    }

    resetStatus(callback=null)
    {
        if (this.state.status !== DEFAULT_MODE)
        {
            this.setState({status: DEFAULT_MODE}, callback);
        }
        else if (callback)
        {
            callback();
        }
    }

    getValue()
    {
        return this.state.value;
    }

    getStatus()
    {
        return this.state.status;
    }

    onChange(e)
    {
        const nextValue = e.target.value;
        if (this.state.value !== nextValue)
        {
            this.setState({value: nextValue, status: DEFAULT_MODE});
        }
    }

    /** @override */
    render()
    {
        const onDelete = this.props.onDelete;
        const showDelete = true;

        const onTest = this.props.onTest;
        const showTest = true;

        const active = this.props.active;
        // const subtitle = this.props.subtitle;
        const placeholder = this.props.placeholder;
        const status = this.state.status;

        return (
            <div id={this.props.id}
                className={Style.test_item_container +
          (active ? ' active ' : '') +
          ' ' + status +
          ' ' + this.props.className}
                style={this.props.style}>
                {showTest &&
          <IconButton className={Style.test_button}
              title={'Test'}
              disabled={!onTest}
              onClick={(e) => onTest(e, this)}>
              {status === SUCCESS_MODE ?
                  <CheckCircleIcon/> :
                  status === FAILURE_MODE ?
                      <CrossCircleIcon/> :
                      status === WORKING_MODE ?
                          <PendingIcon/> :
                          <RunningManIcon/>}
          </IconButton>}
                <div className={Style.test_input}>
                    <input ref={ref=>this.inputElement=ref} type="text"
                        placeholder={placeholder}
                        value={this.state.value}
                        onChange={this.onChange}/>
                    <label>{this.props.subtitle}</label>
                </div>
                {showDelete &&
          <IconButton className={Style.delete_button}
              title={'Delete'}
              disabled={!onDelete}
              onClick={(e) => onDelete(e, this)}>
              <SubtractIcon/>
          </IconButton>}
            </div>
        );
    }
}

export default TestItem;
