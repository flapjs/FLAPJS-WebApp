import React from 'react';
import Style from './StateListView.css';

import IconButton from 'experimental/components/IconButton.js';
import BoxAddIcon from 'components/iconset/BoxAddIcon.js';
import TriangleIcon from 'components/iconset/TriangleIcon.js';

import StateListElement from './StateListElement.js';

class StateListView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._prevX = 0;
        this._prevY = 0;

        this.onElementAdd = this.onElementAdd.bind(this);
        this.onElementFocus = this.onElementFocus.bind(this);
        this.onElementBlur = this.onElementBlur.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
    }

    onElementAdd(e)
    {
        const graphController = this.props.graphController;
        this._prevX += 16;
        this._prevY += 16;
        const node = graphController.createNode(this._prevX, this._prevY);
        graphController.focusOnNode(node);
    }

    onElementFocus(e, element)
    {
        this._prevX = element.props.node.x;
        this._prevY = element.props.node.y;
        const graphController = this.props.graphController;
        graphController.focusOnNode(element.props.node);
    }

    onElementBlur(e, element, nextLabel)
    {
        const node = element.props.node;
        if (!node) return;

        const graphController = this.props.graphController;

        //The value is already processed, abort
        if (nextLabel !== null)
        {
            const graph = graphController.getGraph();
            if (nextLabel.length > 0)
            {
                const otherNodes = graph.getNodesByLabel(nextLabel);
                if (otherNodes.length <= 0)
                {
                    //None other have the same name. Rename it!
                    graphController.renameNode(node, nextLabel);
                }
                else
                {
                    //Found something already named that! Ignore!
                }
            }
            else if (node.getNodeCustom())
            {
                //Remove custom naming instead of deleting.
                node.setNodeCustom(false);
                graphController.applyAutoRename();
            }
            else
            {
                //Delete!
                graphController.deleteTargetNode(node);
            }
        }
    }

    onElementChange(e, element, value)
    {
        const graphController = this.props.graphController;

        if (value.length > 0)
        {
            const graph = graphController.getGraph();
            const otherNodes = graph.getNodesByLabel(value);

            //If there are more than 1 nodes by the same name,
            //OR if the duplicate node found is NOT the same node
            if (otherNodes.length > 1 || (otherNodes.length === 1 && otherNodes[0] !== element.props.node))
            {
                throw new Error('Not a valid node label');
            }
        }
    }

    /** @override */
    render()
    {
        const graphController = this.props.graphController;
        const graph = graphController.getGraph();
        const nodes = graph.getNodes();

        return (
            <div id={this.props.id}
                className={Style.list_container}
                style={this.props.style}>
                <div className={Style.element_list}>
                    <TriangleIcon className={Style.first_marker}/>
                    {nodes.map(e => <StateListElement key={e.getGraphElementID()}
                        node={e}
                        onFocus={this.onElementFocus}
                        onBlur={this.onElementBlur}
                        onChange={this.onElementChange}/>)}
                </div>
                <IconButton className={Style.add_button}
                    title="Add State"
                    onClick={this.onElementAdd}>
                    <BoxAddIcon/>
                </IconButton>
            </div>
        );
    }
}

export default StateListView;
