import React from 'react';
import { hot } from 'react-hot-loader';

import './HomePage.css';

import Footer from "./Footer";
import Header from "./Header";

class HomePage extends React.Component {

    constructor(props) {
        super(props);
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

//For hotloading this class
export default hot(module)(HomePage);
