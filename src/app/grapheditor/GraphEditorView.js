import React from 'react';
import PropTypes from 'prop-types';

import ViewportComponent from 'util/input/components/ViewportComponent.js';

/** @class */
class GraphEditorView extends React.Component
{
    /** @constructor */
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
    }

    /** @override */
    componentDidMount()
    {

    }

    /** @override */
    componentWillUnmount()
    {

    }

    getViewportAdapter() { return this._ref.current; }

    /** @override */
    render()
    {
        return (
            <ViewportComponent
                ref={this._ref}
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}>
            </ViewportComponent>
        );
    }
}

GraphEditorView.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};

export default GraphEditorView;
