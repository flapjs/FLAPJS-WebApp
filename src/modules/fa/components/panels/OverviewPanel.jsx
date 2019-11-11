import React from 'react';
import PropTypes from 'prop-types';

import Pane from '@flapjs/components/drawer/pane/Pane.jsx';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components/icons/Icons.js';

class OverviewPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <>
            <header>
                <h1>Overview</h1>
            </header>
            <Pane title="Definition">
                <section>
                    <h2>States</h2>
                </section>
                <section>
                    <h2>Alphabet</h2>
                </section>
                <section>
                    <h2>Transitions</h2>
                </section>
                <section>
                    <input id="overviewDeterministic" type="checkbox"/>
                    <label htmlFor="overviewDeterministic">
                        Deterministic
                    </label>
                </section>
            </Pane>
            <Pane title="Format">
                <p>
                    <button>Rename alphabet symbol</button>
                </p>
                <p>
                    <button>Apply layout to graph</button>
                </p>
            </Pane>
            <Pane title="Automatic">
                <p>
                    <label htmlFor="overviewLabelPrefix">
                        Automatic node label prefix
                    </label>
                    <input id="overviewLabelPrefix"type="text"/>
                </p>
                <p>
                    <label htmlFor="overviewLabelAffix">
                        Automatic node index set
                    </label>
                    <input id="overviewLabelPrefix"type="text"/>
                </p>
                <p>
                    <input id="overviewAutoLabel" type="checkbox"/>
                    <label htmlFor="overviewAutoLabel">
                        Automatically assign node labels
                    </label>
                </p>
                <p>
                    <input id="overviewAutoPlace" type="checkbox"/>
                    <label htmlFor="overviewAutoPlace">
                        Automatically organize nodes
                    </label>
                </p>
                <p>
                    <input id="overviewSnapGrid" type="checkbox"/>
                    <label htmlFor="overviewSnapGrid">
                        Force snap to grid
                    </label>
                </p>
            </Pane>
            </>
        );
    }
}
OverviewPanel.Tab = Tab;

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

export default OverviewPanel;
