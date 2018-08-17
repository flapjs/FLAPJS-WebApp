import React from "react";

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
          window.location.href = "./dist/app.html";
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
