import React from 'react';
import Style from './TrashCanWidget.css';

import TrashCanDetailedIcon from 'components/iconset/TrashCanDetailedIcon.js';

const DOUBLE_TAP_TIME = 250;

class TrashCanWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;

        this.state = {
            forceActive: false
        };

        this._doubleTapTimeout = null;

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);

        //HACK: This is kinda a hack to lose trash mode focus...
        this.onAnyMouseDownNotConsumed = this.onAnyMouseDownNotConsumed.bind(this);
    }

    onMouseEnter(e)
    {
        if (this.state.forceActive) return;

        this.props.inputController.setTrashMode(true);
    }

    onMouseLeave(e)
    {
        if (this.state.forceActive) return;

        this.props.inputController.setTrashMode(false);
    }

    onClick(e)
    {
        e.stopPropagation();
        e.preventDefault();

        if (this._doubleTapTimeout)
        {
            //This is a double tap!
            clearTimeout(this._doubleTapTimeout);
            this._doubleTapTimeout = null;
            this.setState({forceActive: false});

            this.props.app.getSession().getCurrentModule().clear(this.props.app, true);
            this.props.inputController.setTrashMode(false);
        }
        else
        {
            //This is a single tap!
            this.setState((prev, props) => {
                const result = !prev.forceActive;
                props.inputController.setTrashMode(result);
                this._doubleTapTimeout = setTimeout(() => {
                    this._doubleTapTimeout = null;
                }, DOUBLE_TAP_TIME);

                if (result)
                {
                    document.documentElement.addEventListener('mousedown', this.onAnyMouseDownNotConsumed);
                }

                return {
                    forceActive: result
                };
            });
        }
    }

    onAnyMouseDownNotConsumed(e)
    {
        if (this.state.forceActive && this.ref !== e.target)
        {
            e.stopPropagation();
            e.preventDefault();

            document.documentElement.removeEventListener('mousedown', this.onAnyMouseDownNotConsumed);

            this.props.inputController.setTrashMode(false);
            this.setState({forceActive: false});
        }
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const graphController = this.props.graphController;
        const inputAdapter = inputController.getInputAdapter();

        const active = inputController.isTrashMode();
        const hide = !active && (graphController.getGraph().isEmpty() || (inputAdapter.isUsingTouch() && inputAdapter.isDragging()));

        return (
            <div ref={ref=>this.ref=ref} id={this.props.id}
                className={Style.trash_container +
          (active ? " active " : "") +
          (hide ? " hide " : "") +
          " " + this.props.className}
                style={this.props.style}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onClick}>
                <TrashCanDetailedIcon/>
            </div>
        );
    }
}

export default TrashCanWidget;
