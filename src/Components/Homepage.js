import React from 'react';

import pic from './Pictures/jflaplogo.png';

class Homepage extends React.Component{

    constructor(props){
        super(props)

    }

    render() {

        return (

            <div className="title">
                <h1>JFLAP <img src={pic} /> </h1>
            </div>
        );

    }

}

export default Homepage;