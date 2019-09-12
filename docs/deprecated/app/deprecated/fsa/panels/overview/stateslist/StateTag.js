import React from 'react';
import './StateTag.css';

import Config from 'deprecated/config.js';

class StateTag extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: null,
            error: false
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onFocus(e)
    {
        const target = e.target;
        //This is a prop, refer to StateList for the actual node.getNodeLabel()
        this.setState({ value: this.props.label, error: false }, () => 
        {
            target.select();
        });

        //Call any listening focus
        if (this.props.onFocus) this.props.onFocus(e);
    }

    onBlur(e)
    {
        const graphController = this.props.graphController;
        const newLabel = this.state.value;

        //The value is already processed, abort
        if (newLabel != null)
        {
            const node = this.props.src;
            const graph = graphController.getGraph();
            if (newLabel.length > 0)
            {
                const nodes = graph.getNodesByLabel(newLabel);
                if (nodes.length <= 0)
                {
                    //Valid! Rename it!
                    graphController.renameNode(node, newLabel);
                }
                else
                {
                    //Found something already named that! Ignore!
                }
            }
            else
            {
                //Delete!
                graphController.deleteTargetNode(this.props.src);
            }

            this.setState({ value: null, error: false });

            //Call any listening blurs
            if (this.props.onBlur) this.props.onBlur(e);
        }
    }

    onKeyDown(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
        {
            e.preventDefault();
        }
    }

    onKeyUp(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY)
        {
            e.target.blur();
        }
        else if (e.keyCode === Config.CLEAR_KEY)
        {
            const target = e.target;
            this.setState({ value: null, error: false}, () => 
            {
                target.blur();
            });
        }
    }

    onValueChange(e)
    {
        const graph = this.props.graphController.getGraph();
        const value = e.target.value.trim();
        let error = false;
        if (value.length > 0)
        {
            const nodes = graph.getNodesByLabel(value);
            if (nodes.length > 0)
            {
                //If there are more than 1 that have the same name
                //OR if it is NOT the one we have...
                if (nodes.length > 1 || nodes[0] !== this.props.src)
                {
                    error = true;
                }
            }
        }

        this.setState({
            value: value,
            error: error
        });
    }

    render()
    {
        const isCustom = this.props.src.getNodeCustom();
        const value = this.state.value != null ? this.state.value : this.props.label;
        return <div className={'statetag-container' +
      (isCustom ? ' customtag' : '') +
      (value.length == 0 ? ' emptytag' : '') +
      (this.state.value && this.state.error ? ' errortag' : '')}>
            <input type="text" className={(this.props.accept ? ' accept' : '')}
                spellCheck="false"
                style={{width: value.length + 'ch'}}
                value={value}
                onChange={this.onValueChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}/>
        </div>;
    }
}

export default StateTag;
