import React from 'react';

export default class UndoIcon extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <svg className="navIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">
          <g id="Bounding_Boxes">
          	<g id="ui_x5F_spec_x5F_header_copy_3" display="none">
          	</g>
          	<path fill="none" d="M0,0h24v24H0V0z"/>
          </g>
          <g id="Outline">
          	<g id="ui_x5F_spec_x5F_header" display="none">
          	</g>
          	<path d="M12.5,8c-2.65,0-5.05,0.99-6.9,2.6L2,7v9h9l-3.62-3.62c1.39-1.16,3.16-1.88,5.12-1.88c3.54,0,6.55,2.31,7.6,5.5l2.37-0.78
          		C21.08,11.03,17.15,8,12.5,8z"/>
          </g>
        </svg>
    );
  }
}