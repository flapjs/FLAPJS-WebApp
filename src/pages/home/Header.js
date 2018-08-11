import React from 'react';

import pic from './Pictures/flaplogo.png';
class Header extends React.Component{

    render() {

        return (
                <div className="title">
                    <img src={pic} />
                </div>

        );
    }
}

export default Header;