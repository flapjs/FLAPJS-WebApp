import React from 'react';
import PropTypes from 'prop-types';

import Pane from '@flapjs/components/drawer/pane/Pane.jsx';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components/icons/Icons.js';

class TestingPanel extends React.Component
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
                <h1>Testing</h1>
            </header>
            <Pane title="String Tests">
                <section>
                    <button>
                        New String Tests
                    </button>
                    <button>
                        Load String Tests
                    </button>
                    <button>
                        Export String Tests
                    </button>
                </section>
            </Pane>
            <Pane title="Validation">
                <p>
                    <label htmlFor="testingErrorCheck">
                        Real-time error checking
                    </label>
                    <input id="testingErrorCheck" type="checkbox"/>
                </p>
            </Pane>
            </>
        );
    }
}
TestingPanel.Tab = Tab;

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

export default TestingPanel;
