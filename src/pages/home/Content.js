import React from 'react';


class Content extends React.Component{



    constructor(props){
        super(props);
    }


    render(){

        return(

            <div className = "content">
            <h1> Welcome to flap.js !</h1>
                <p> Currently supporting NFA and DFA </p>
            </div>
        );

    }

}

export default Content;