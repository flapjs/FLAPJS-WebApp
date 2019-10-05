import React from 'react';
import PropTypes from 'prop-types';
// import Style from './SessionTitleInput.module.css';

import * as FlapJSModules from '@flapjs/FlapJSModules.js';

/**
 * A React component that can do anything you want.
 */
class TitleInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            title: ''
        };

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onModuleChange = this.onModuleChange.bind(this);
    }

    onTitleChange(e)
    {
        const newValue = e.target.value;
        this.setState({ title: newValue });
    }

    onModuleChange(e)
    {
        window.alert(e.target.value);
    }

    renderTitleInput()
    {
        return (
            <input type="text" value={this.state.title} onChange={this.onTitleChange}/>
        );
    } 

    renderModuleOptions(modules)
    {
        const result = [];
        for(const moduleID of Object.keys(modules))
        {
            result.push(
                <option key={moduleID} value={moduleID}>
                    {moduleID}
                </option>
            );
        }
        return (
            <select onBlur={this.onModuleChange}>
                {result}
            </select>
        );
    }

    /** @override */
    render()
    {
        const props = this.props;

        return (
            <div className={props.className}>
                {this.renderModuleOptions(FlapJSModules)}
                {this.renderTitleInput()}
            </div>
        );
    }
}

TitleInput.propTypes = {
    className: PropTypes.string,
};
TitleInput.defaultProps = {
};

export default TitleInput;
