import React from 'react';
import PropTypes from 'prop-types';

import Style from './ViewportEditLayer.module.css';

import TrashCanWidget from '../widgets/TrashCanWidget.jsx';
import ModeTrayWidget, { MODE_ACTION, MODE_MOVE } from '../widgets/ModeTrayWidget.jsx';

class ViewportEditLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onTrashChange = this.onTrashChange.bind(this);
        this.onTrashClear = this.onTrashClear.bind(this);
        this.onModeChange = this.onModeChange.bind(this);
    }

    onTrashChange(flag)
    {
        this.props.inputController.setTrashMode(flag);

        if (this.props.onTrashChange)
        {
            this.props.onTrashChange(flag);
        }

        //TODO: Fix this
        /**
            If (flag)
            {
                this.props.session.getApp().getDrawerComponent().setViewportColor('var(--color-viewport-error)');
            }.
            Else
            {
                this.props.session.getApp().getDrawerComponent().setViewportColor(null);
            }.
         */
    }

    onTrashClear()
    {
        this.props.graphController.clearGraph();
    }

    onModeChange(value)
    {
        this.props.inputController.setMoveModeFirst(value === MODE_MOVE);
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const graphController = this.props.graphController;
        const viewController = this.props.viewController;
        const graph = graphController.getGraph();

        let moveMode = null;
        if (inputController)
        {
            if (inputController.isHandlingInput())
            {
                moveMode = inputController.isMoveMode(viewController.getInputAdapter()) ? MODE_MOVE : MODE_ACTION;
            }
            else
            {
                moveMode = inputController.isMoveModeFirst() ? MODE_MOVE : MODE_ACTION;
            }
        }

        return (
            <>
                <TrashCanWidget className={Style.view_widget}
                    style={{ position: 'absolute', bottom: 0, right: 0 }}
                    visible={!graph.isEmpty() && viewController &&
						(!viewController.getInputAdapter().isUsingTouch() || !viewController.getInputAdapter().isDragging())}
                    onChange={this.onTrashChange}
                    onClear={this.onTrashClear} />
                <ModeTrayWidget className={Style.view_widget}
                    style={{ bottom: 0, left: 0 }}
                    visible={inputController ? true : false}
                    mode={moveMode}
                    onChange={this.onModeChange} />
                {this.props.children}
            </>
        );
    }
}
ViewportEditLayer.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    // TODO: Fix types.
    viewController: PropTypes.any,
    inputController: PropTypes.any,
    graphController: PropTypes.any,
    viewport: PropTypes.any,
    onTrashChange: PropTypes.func,
};

export default ViewportEditLayer;
