import React from 'react';

import ucsdlogo from './Pictures/ucsdlogo.gif';

class Footer extends React.Component{

    render() {

        return (
                    <div className="footer">
                        <footer>
                            <p> <img src={ucsdlogo} /> © 2018 University of California, San Diego. All rights reserved. </p>
                        </footer>
                    </div>
        );
    }
}

export default Footer;