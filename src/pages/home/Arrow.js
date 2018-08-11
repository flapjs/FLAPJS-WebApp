import React from 'react';

class Arrow extends React.Component{

    constructor(props){
        super(props)

    }

    onClick(ev)
    {
        this.props.router.pathname = "/app";
    }

    render(){
        return(

            <div className = "arrow" onClick={this.onClick.bind(this)}>

                    <a className='animated-arrow'>

                        <span className='the-arrow -left'>

                            <span className='shaft'></span>

                        </span>

                        <span className='main'>

                            <span className='text'>

                                Launch Workspace!

                            </span>

                            <span className='the-arrow -right'>

                                <span className='shaft'></span>

                            </span>

                        </span>
                    </a>
            </div>



        );
    }
}

export default Arrow;
