import React from 'react';
import PropTypes from 'prop-types';
import Style from './ViewportNavigationLayer.module.css';

import ZoomWidget from '../widgets/ZoomWidget.jsx';
import FocusCenterWidget from '../widgets/FocusCenterWidget.jsx';

class ViewportNavigationLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;

        return (
            <div id={this.props.id}
                className={Style.navbar_container +
                    ' ' + this.props.className}
                style={this.props.style}>
                <ZoomWidget className={Style.navbar_widget_container}
                    viewportAdapter={viewportAdapter} />
                <FocusCenterWidget className={Style.navbar_widget}
                    viewportAdapter={viewportAdapter} />
                {this.props.children}
            </div>
        );
    }
}
ViewportNavigationLayer.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    // TODO: Fix types.
    viewportAdapter: PropTypes.any,
};

export default ViewportNavigationLayer;
