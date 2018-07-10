import React from 'react';
import Title from "./Title";

class Homepage extends React.Component{

    constructor(props){
        super(props)

    }

    render(){
        return(

            <div className = "title-container" >

                < Title/>

            </div>

        );
    }
}

export default Homepage;