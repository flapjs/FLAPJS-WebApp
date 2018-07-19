import React from 'react';

class Arrow extends React.Component{

    constructor(props){
        super(props)

    }

    onClick(ev)
    {
      alert("GO TO OTHER PAGE!");
    }

    render(){
        return(

            <div className = "arrow" onClick={this.onClick.bind(this)}>

                <h2> Let's Get Started ! </h2>

                <div className="circle arrowbutton">

                    <h1> &#9654; </h1>

                </div>

            </div>



        );
    }
}

export default Arrow;
