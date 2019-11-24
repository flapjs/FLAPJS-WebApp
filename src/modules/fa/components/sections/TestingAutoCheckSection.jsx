import React from 'react';

class TestingAutoCheckSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            autoErrorCheck: true
        };

        this.onAutoCheckChange = this.onAutoCheckChange.bind(this);
    }

    onAutoCheckChange(e)
    {
        this.setState({ autoErrorCheck: e.target.value });
    }

    /** @override */
    render()
    {
        const state = this.state;

        return (
            <fieldset>
                <legend>Real-time error checking</legend>
                <input
                    id="testingErrorCheck"
                    type="checkbox"
                    value={state.autoErrorCheck}
                    onChange={this.onAutoCheckChange}/>
                <label htmlFor="testingErrorCheck">
                    Enable real-time error checking
                </label>
            </fieldset>
        );
    }
}

export default TestingAutoCheckSection;
