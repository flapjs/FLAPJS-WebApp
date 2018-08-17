import React from "react";

class Help extends React.Component{

    constructor(props){
        super(props);
    }

    onClick()
    {
        var newtab = window.open("https://github.com/flapjs/FLAPJS-WebApp/blob/intro_page/src/pages/home/Help.md", '_blank');
        newtab.focus();
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
