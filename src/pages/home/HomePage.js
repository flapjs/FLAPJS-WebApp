import React from 'react';
import { hot } from 'react-hot-loader';

import './HomePage.css';

import Footer from "./Footer";
import Header from "./Header";
import Arrow from "./Arrow";
import Squares from "./Squares";

class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (

            <div className="homepage-container">
                <Header/>
                <Squares/>
                <Arrow router={this.props.router}/>
                <Footer/>
            </div>




        );

    }

}

//For hotloading this class
export default hot(module)(HomePage);
