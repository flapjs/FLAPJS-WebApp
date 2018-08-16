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
        const timeout = 300;
        const homepage = document.getElementById("homepage");
        homepage.style.animation = "fadeout " + timeout + "ms";
        setTimeout(() => {
          Router.routeTo("/app");
        }, timeout);
    }

    render()
    {
        return(
            <div className="buttons" onClick={this.onClick.bind(this)}>
                Launch Workspace
            </div>
        );
    }
}

export default Button;
