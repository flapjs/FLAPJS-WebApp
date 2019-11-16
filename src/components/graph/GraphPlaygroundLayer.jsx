import React from 'react';
import PropTypes from 'prop-types';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';
import GraphView from '@flapjs/systems/graph/components/GraphView.jsx';

class GraphPlaygroundLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this._graphAnimationFrame = this.update.bind(this);
        this._graphRequestAnimationFrame = null;
    }

    /** @override */
    componentDidMount()
    {
        this._graphRequestAnimationFrame = requestAnimationFrame(this._graphAnimationFrame);
    }

    /** @override */
    componentWillUnmount()
    {
        cancelAnimationFrame(this._graphRequestAnimationFrame);
    }

    update()
    {
        // HACK: This will re-render the graph at 60fps REGARDLESS if it has updated.
        this._graphRequestAnimationFrame = requestAnimationFrame(this._graphAnimationFrame);
        this.forceUpdate();
    }

    /** @override */
    render()
    {
        const props = this.props;
        return (
            <SessionStateConsumer>
                {
                    session =>
                        <GraphView
                            inputController={session.inputController}
                            viewController={session.viewController}
                            renderGraph={props.renderGraph}
                            renderOverlay={props.renderOverlay}>
                        </GraphView>
                }
            </SessionStateConsumer>
        );
    }
}
GraphPlaygroundLayer.propTypes = {
    renderGraph: PropTypes.func,
    renderOverlay: PropTypes.func,
};
GraphPlaygroundLayer.defaultProps = {
    renderGraph: () => {},
    renderOverlay: () => {}
};

export default GraphPlaygroundLayer;

