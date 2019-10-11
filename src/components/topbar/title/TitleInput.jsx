import React from 'react';
import PropTypes from 'prop-types';
// import Style from './SessionTitleInput.module.css';

import * as FlapJSModules from '@flapjs/FlapJSModules.js';
import { SessionConsumer } from '@flapjs/contexts/session/SessionContext.jsx';

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

    onModuleChange(e, changeModuleCallback)
    {
        const nextModuleID = e.target.value;
        changeModuleCallback(nextModuleID);
    }

    renderTitleInput()
    {
        return (
            <input type="text" value={this.state.title} onChange={this.onTitleChange}/>
        );
    } 

    renderModuleOptions(modules, currentModuleID, changeModuleCallback)
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
            <select defaultValue={currentModuleID} onBlur={(e) => this.onModuleChange(e, changeModuleCallback)}>
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
                <SessionConsumer>
                    {
                        (state, dispatch) => this.renderModuleOptions(
                            FlapJSModules,
                            state.moduleID,
                            nextModuleID => dispatch({ type: 'change-module', value: nextModuleID })
                        )
                    }
                </SessionConsumer>
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
