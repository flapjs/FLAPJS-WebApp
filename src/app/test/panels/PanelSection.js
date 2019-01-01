import React from 'react';
import Style from './PanelSection.css';

import IconButton from 'test/components/IconButton.js';
import TinyDownIcon from 'test/iconset/TinyDownIcon.js';
import TinyUpIcon from 'test/iconset/TinyUpIcon.js';

class PanelSection extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      open: props.initial || false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    this.setState((prev, props) => {
      return {open: !prev.open};
    })
  }

  //Override
  render()
  {
    const isOpen = this.state.open;
    const isDisabled = this.props.disabled || React.Children.count(this.props.children) <= 0;
    const title = this.props.title;
    return (
      <section id={this.props.id}
        className={Style.section_container +
          " " + this.props.className}
        style={this.props.style}>
        <IconButton className={Style.section_header}
          title={title}
          disabled={isDisabled}
          onClick={this.onClick}>
          {!isOpen ? <TinyDownIcon/> : <TinyUpIcon/>}
        </IconButton>
        <div className={Style.section_content_container +
          (isOpen ? " open " : "")}>
          <div className={Style.section_content}>
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
}

export default PanelSection;
