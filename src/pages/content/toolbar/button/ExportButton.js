//https://material.io/tools/icons/?search=save&icon=save_alt&style=outline
import React from 'react';

class ExportButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {

  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-export"
                   onClick={this.onClick.bind(this)}>
      <svg className="navicons" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_3" display="none">
          </g>
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <g id="ui_x5F_spec_x5F_header" display="none">
          </g>
          <path d="M19,12v7H5v-7H3v7c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-7H19z M13,12.67l2.59-2.58L17,11.5l-5,5l-5-5l1.41-1.41L11,12.67V3
		h2V12.67z"/>
        </g>
      </svg>
    </button>;
  }
}

export default ExportButton;
