import React from 'react';

class Logo extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    return <svg version="1.1" id={this.props.id} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    	 viewBox="0 0 300 100">
      <style type="text/css">
      {
      	`.st0{fill:none;stroke:#000000;stroke-miterlimit:10;}
      	.st1{fill:#FFC82C;stroke:#7E55F3;stroke-width:2;stroke-miterlimit:10;}
      	.st2{fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
      	.st3{font-family:'PTSans-Regular';}
      	.st4{font-size:90px;}
      	.st5{fill:none;}`
      }
      </style>
      <path className="st0" d="M43.7,20.1c0-9.4-8.5-17.1-19.1-17.1"/>
      <circle className="st1" cx="44.1" cy="45.3" r="29.6"/>
      <polygon className="st2" points="44.1,42.1 20.2,83.5 68,83.5 "/>
      <text transform="matrix(1 0 0 1 74.1533 77.1901)" className="st3 st4">flap.js</text>
      <path className="st5" d="M40.9,89c0,2.9,73.6,5.2,164.6,5.2"/>
      <path className="st5" d="M228.2,65.6c0,15.8-10.1,28.6-22.7,28.6"/>
      <path className="st5" d="M42.4,83.9c0,7,73,12.6,163.1,12.6"/>
      <path className="st5" d="M228.2,65.6c0,15.8-10.1,28.6-22.7,28.6"/>
      <path className="st5" d="M228.2,65.6c0,15.8-10.1,28.6-22.7,28.6"/>
      <path className="st0" d="M227.6,72.1c0,13.7-22.7,24.8-50.7,24.8"/>
      <path className="st0" d="M6,20.1C6,10.7,14.5,3.1,25,3.1"/>
      <line className="st0" x1="6" y1="20.1" x2="6" y2="77.2"/>
      <path className="st0" d="M6,77.2C6,88.1,27,96.9,53,96.9"/>
      <line className="st0" x1="57.3" y1="96.9" x2="177.4" y2="96.9"/>
      <line className="st0" x1="53" y1="96.9" x2="64.5" y2="96.9"/>
    </svg>;
  }
}

export default Logo;
