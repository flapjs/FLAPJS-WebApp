import React from 'react';

import './style.css';

import image from './Pictures/UCSD_logo.png'

class Footer extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){


        return(


        <footer>


            <div className="footer">


                <img className="ucsdlogo" src = {image} />

                <p> © 2018 University of California, San Diego. All rights reserved </p>


            </div>

        </footer>


        );
    }


}

export default Footer;