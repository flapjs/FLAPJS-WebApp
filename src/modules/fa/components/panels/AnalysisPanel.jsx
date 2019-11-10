import React from 'react';
import PropTypes from 'prop-types';

import Pane from '@flapjs/components/drawer/pane/Pane.jsx';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components/icons/Icons.js';

import TestEquivalenceSection from './TestEquivalenceSection.jsx';

class AnalysisPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            optimizeUnreachable: true,
            optimizeRedundant: false,
        };

        this.onChangeOptimizeUnreachable = this.onChangeOptimizeProperty.bind(this, 'optimizeUnreachable');
        this.onChangeOptimizeRedundant = this.onChangeOptimizeProperty.bind(this, 'optimizeRedundant');
        this.onPerformOptimization = this.onPerformOptimization.bind(this);
        this.onPerformDeterministicConversion = this.onPerformDeterministicConversion.bind(this);
        this.onPerformFlipAcceptStates = this.onPerformFlipAcceptStates.bind(this);
    }

    onChangeOptimizeProperty(key, e)
    {
        this.setState({ [key]: e.target.value });
    }

    onPerformOptimization()
    {

    }

    onPerformDeterministicConversion()
    {

    }

    onPerformFlipAcceptStates()
    {

    }

    /** @override */
    render()
    {
        return (
            <>
                <h1>Analysis</h1>
                <Pane title="Equivalent Conversions">
                    <ul>
                        <li>
                            <button>Perform selected optimizations</button>
                            <ul>
                                <li>
                                    <label htmlFor="analysisOptimizationUnreachable">
                                        Remove unreachable states
                                    </label>
                                    <input id="analysisOptimizationUnreachable"
                                        type="checkbox"
                                        value={this.state.optimizeUnreachable}
                                        onChange={this.onChangeOptimizeUnreachable} />
                                </li>
                                <li>
                                    <label htmlFor="analysisOptimizationRedundant">
                                        Remove redundant empty transitions
                                    </label>
                                    <input id="analysisOptimizationRedundant"
                                        type="checkbox"
                                        disabled={true}
                                        value={this.state.optimizeRedundant}
                                        onChange={this.onChangeOptimizeRedundant}/>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button disabled={false} onClick={this.onPerformDeterministicConversion}>
                                Convert to valid deterministic machine
                            </button>
                        </li>
                    </ul>
                </Pane>
                <Pane title="Related Converions">
                    <ul>
                        <li>
                            <button disabled={true} onClick={this.onPerformFlipAcceptStates}>
                                Flip all accept states
                            </button>
                        </li>
                    </ul>
                </Pane>
                <Pane title="Equivalence Test">
                    <TestEquivalenceSection></TestEquivalenceSection>
                </Pane>
            </>
        );
    }
}
AnalysisPanel.Tab = Tab;

function Tab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton
            onClick={onClick}
            iconClass={RunningManIcon}
            {...otherProps}/>
    );
}
Tab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default AnalysisPanel;
