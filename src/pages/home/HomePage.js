import React from 'react';

import Footer from "./Footer";
import Header from "./Header";

import './HomePage.css';

class HomePage extends React.Component{

    constructor(props){
        super(props)

    }

    render() {

        return (

            <div className="homepage-container">
                <Header/>
                <Footer/>
            </div>

        );

    }

}

export default HomePage;
