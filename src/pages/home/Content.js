import React from 'react';


class Content extends React.Component{



    constructor(props){
        super(props);
    }


    render(){

        return(

            <div className = "content">
            <h1> Welcome to FLAP.js </h1>
                <p> Making Automata Theory usabilty Cross-Platform </p>
            </div>
        );

    }

}

export default Content;