import React from 'react';
import { hot } from 'react-hot-loader';


import './HomePage.css';


import pic from './Pictures/flapjs.svg';

import Button from "./Button";
import Help from "./Help";

class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage-container" id="homepage">
                <div className="title">
                    <img src={pic} />
                </div>
                <div className = "content">
                    <h1> Welcome to flap.js !</h1>
                    <p> Currently supporting NFA and DFA </p>
                </div>
                <Button router = {this.props.router}/>
                <Help/>
            </div>
        );

    }

}

//For hotloading this class
export default hot(module)(HomePage);
