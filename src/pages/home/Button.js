import React from "react";
import Router from 'router.js';

class Button extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onClick(ev)
    {
        Router.routeTo("/app");
    }

    render()
    {
        return(
            <div className="buttons" onClick={this.onClick.bind(this)}>
            <button type="button" className="btn btn-default"> Launch Workspace </button>
            </div>
        );
    }
}

export default Button;
