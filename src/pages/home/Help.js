import React from "react";
import Router from "../../router";

class Help extends React.Component{

    constructor(props){
        super(props);
    }

    onClick()
    {
        //window.location.href="https://github.com/flapjs/FLAPJS-WebApp/blob/intro_page/src/pages/home/Help.md";
        var win = window.open("https://github.com/flapjs/FLAPJS-WebApp/blob/intro_page/src/pages/home/Help.md", '_blank');
        win.focus();
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