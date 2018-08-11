import React from 'react';

import './HomePage.css';

class Squares extends React.Component{

    constructor(props){
        super(props)

    }

    render(){
        return(

            <div className = "squares">
                <ul>
                    <li> <p className = "btn-square intro"> <span className = "flapjs"> Development </span> </p></li>
                    <li> <p className = "btn-square class"> <span className = "cse105"> CSE 105 </span> </p></li>
                    <li> <p className = "btn-square original"> <span className= "jflap"> JFLAP </span> </p> </li>
                </ul>
            </div>
        );
    }
}

export default Squares;