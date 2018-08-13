import React from 'react';
import { hot } from 'react-hot-loader';

import './HomePage.css';

import Footer from "./Footer";
import Header from "./Header";
import Arrow from "./Arrow";
import Squares from "./Squares";
import Content from "./Content";
import Button from "./Button";

class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        //<Arrow router={this.props.router}/>
        return (
            <div className="homepage-container" id="homepage">
                <Header/>
                <Content/>
                <Button/>
            </div>
        );

    }

}

//For hotloading this class
export default hot(module)(HomePage);
