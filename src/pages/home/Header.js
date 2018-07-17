import React from 'react';

import pic from './Pictures/jflaplogo.png';
class Header extends React.Component{

    render() {

        return (
            <div className="title">
                <h1>JFLAP <img src={pic} /> </h1>
            </div>
        );
    }
}

export default Header;