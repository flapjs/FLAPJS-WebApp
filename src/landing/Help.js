import React from "react";

class Help extends React.Component{

    constructor(props){
        super(props);
    }

    onClick(ev)
    {
        window.location.href="https://github.com/flapjs/FLAPJS-WebApp/blob/intro_page/src/pages/home/Help.md";
    }

    render()
    {
        return(
            <div className="helpbutton" onClick={this.onClick.bind(this)}>
                <text> Help ? </text>
            </div>
        );
    }


}

export default Help;
