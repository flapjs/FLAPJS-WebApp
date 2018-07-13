import React from 'react';

import './style.css';

class Circles extends React.Component{

    constructor(props){
        super(props)

    }

    render(){
        return(

            <div className = "circles" >

                    <p className ="bcircle b1"> This JFLAP web application was developed by a student research group
                        at University of California, San Diego. It is an attempt to make the JFLAP application more
                        portable for students to be able to use it on their laptop or mobile devices.
                    </p>

                    <p className = "bcircle b2"> At UC San Diego, CSE 105 Introduction to Theory of Computability
                        is a core class of the Computer Science curriculum. A description of the course can be found here:
                    <a href="https://cse.ucsd.edu/undergraduate/courses/course-descriptions/cse-105-theory-computability"
                       > CSE105 </a> </p>

                    <p className = "bcircle b3"> More information about JFLAP can be found at:
                        <a href="http://www.jflap.org/"> JFLAP </a> </p>
            </div>
        );
    }
}

export default Circles;