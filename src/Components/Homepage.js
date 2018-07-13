import React from 'react';
import Title from "./Title";
import Circles from "./Circles";
import Arrow from "./Arrow";
import Footer from "./Footer"

class Homepage extends React.Component{

    constructor(props){
        super(props)

    }

    render(){
        return(

            <div className = "title-container" >

                < Title/>
                <Circles/>
                <Arrow/>
                <Footer/>



            </div>

        );
    }
}

export default Homepage;