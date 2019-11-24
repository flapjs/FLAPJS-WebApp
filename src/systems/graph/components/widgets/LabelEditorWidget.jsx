import React from 'react';
import PropTypes from 'prop-types';
import Style from './LabelEditorWidget.module.css';

import GraphElement from '../../model/elements/AbstractGraphElement.js';
import GraphNode from '../../model/elements/GraphNode.js';
import GraphEdge from '../../model/elements/GraphEdge.js';

import PatternInput from './pattern/PatternInput.jsx';

// Taken from EdgeRenderer and NodeRenderer
const EVENT_SOURCE_FORWARD_ENDPOINT = 'forward-endpoint';
const EVENT_SOURCE_EDGE = 'edge';
const EVENT_SOURCE_LABEL = 'label';
const GRAPH_EVENT_EDGE_DELETE = 'edge-delete';

const EVENT_SOURCE_NODE = 'node';
const GRAPH_EVENT_NODE_DELETE = 'node-delete';


class LabelEditorWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
        this.inputComponent = null;

        this.state = {
            open: false
        };

        this._target = null;
        this._targetCallback = null;

        this.onInputSubmit = this.onInputSubmit.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.createOptions = this.createOptions.bind(this);
        this.menuItemHandler = this.menuItemHandler.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    openEditor(graphElement, defaultValue = null, onSubmit = null, onCancel = null)
    {
        if (!(graphElement instanceof GraphElement))
            throw new Error('Can only open editor for GraphElements');

        this._target = graphElement;
        this._targetOnSubmit = onSubmit;
        this._targetOnCancel = onCancel;

        if(this.inputComponent) 
        {
            if (graphElement instanceof GraphNode)
            {
                const formatter = this.props.labelFormatter.getNodeLabelFormatter();
                this.inputComponent.setFormatter(formatter);
            }
            else if (graphElement instanceof GraphEdge)
            {
                const formatter = this.props.labelFormatter.getEdgeLabelFormatter();
                this.inputComponent.setFormatter(formatter);
            }
        }

        const currentTargetType = this.props.inputController.getCurrentTargetType();
        const currentTargetSource = this.props.inputController.getCurrentTargetSource();

        this.setState({ open: true, currentTargetType: currentTargetType, currentTargetSource: currentTargetSource }, () =>
        {
            if(this.inputComponent) 
            {
                this.inputComponent.resetValue(defaultValue || '');
                this.inputComponent.focus();
            }
        });
    }

    closeEditor()
    {
        this._target = null;
        this._targetOnSubmit = null;
        this._targetOnCancel = null;

        this.inputComponent.setFormatter(null);

        this.setState({ open: false, currentTargetType: null, currentTargetSource: null });
    }

    isEditorOpen()
    {
        return this.state.open;
    }

    getTarget()
    {
        return this._target;
    }

    onInputSubmit(value)
    {
        if (this._targetOnSubmit)
        {
            this._targetOnSubmit(this._target, value);
            //Don't handle cancel callbacks...
            this._targetOnCancel = null;
        }
    }

    onInputBlur(e)
    {
        if (this._targetOnCancel)
        {
            this._targetOnCancel(this._target);
            //Don't handle submit callbacks...
            this._targetOnSubmit = null;
        }
        this.closeEditor();
    }

    createOptions() 
    {
        // add different options based on the current type of graph here
        return ['Delete' /*"... more to be implemented based on node type"*/];
    }

    menuItemHandler(e) 
    {
        // Implement more for different items
        switch(e.target.innerText) 
        {
            case 'Delete':
                this.handleDelete();
                break;
            default:
                break;
        }
    }

    handleDelete() 
    {
        const currentTargetType = this.state.currentTargetType;
        const currentTargetSource = this.state.currentTargetSource;
        const graphController = this.props.graphController;

        if (currentTargetType === EVENT_SOURCE_EDGE ||
            currentTargetType === EVENT_SOURCE_FORWARD_ENDPOINT ||
            currentTargetType === EVENT_SOURCE_LABEL) 
        {
            graphController.getGraph().deleteEdge(currentTargetSource);
            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: currentTargetSource});

            this.setState({
                currentTargetType: null,
                currentTargetSource: null
            });

            this.closeEditor();
        }
        else if (currentTargetType === EVENT_SOURCE_NODE)
        {
            graphController.getGraph().deleteNode(currentTargetSource);
            graphController.emitGraphEvent(GRAPH_EVENT_NODE_DELETE, { target: currentTargetSource });
            
            this.setState({
                currentTargetType: null,
                currentTargetSource: null
            });

            this.closeEditor();
        }
    }

    /** @override */
    render()
    {
        const isEditorOpen = this.state.open;

        const target = this._target;
        const targetStyle = this.props.style || {};
        const viewController = this.props.viewController;

        const options = this.createOptions();

        if (viewController)
        {
            const viewportAdapter = viewController.getViewportAdapter();

            if (target)
            {
                const center = target.getCenterPoint();
                const element = viewportAdapter.getElement();
                const parentClientRect = element.getBoundingClientRect();
                const screenPos = transformViewToScreen(
                    element,
                    center.x + viewportAdapter.getOffsetX(),
                    center.y + viewportAdapter.getOffsetY()
                );
                const x = screenPos.x;
                const y = screenPos.y;
                const offsetX = -(this._ref.current.offsetWidth / 2) - parentClientRect.left;
                const offsetY = -(this._ref.current.offsetHeight / 2) - parentClientRect.top;

                targetStyle['top'] = (y + offsetY) + 'px';
                targetStyle['left'] = (x + offsetX) + 'px';
            }
        }

        return (
            <div ref={this._ref}
                id={this.props.id}
                className={Style.editor_container +
                    (isEditorOpen ? ' open' : '') +
                    ' ' + (this.props.className || '')}
                style={targetStyle}>
                <PatternInput ref={ref => this.inputComponent = ref}
                    submitOnBlur={this.props.saveOnExit}
                    onSubmit={this.onInputSubmit}
                    onBlur={this.onInputBlur}
                />
                <div>
                    {
                        options.map((item, ind) => 
                        {
                            return <div className={Style.menu_item}
                                key={ind}
                                onClick={this.menuItemHandler}
                                onKeyDown={this.handleClick}
                                role="button"
                                tabIndex={0}
                            >
                                {item}
                            </div>;
                        })
                    }
                </div>
                <div className={Style.tray_container}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
LabelEditorWidget.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    // TODO: fix type.
    viewController: PropTypes.object.isRequired,
    labelFormatter: PropTypes.any,
    inputController: PropTypes.any,
    graphController: PropTypes.any,
    saveOnExit: PropTypes.bool,
};


function transformViewToScreen(svg, x, y)
{
    const ctm = svg.getScreenCTM();
    return {
        x: (x * ctm.a) + ctm.e,
        y: (y * ctm.d) + ctm.f
    };
}

export default LabelEditorWidget;
