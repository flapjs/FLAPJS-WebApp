import React from 'react';
import Style from './PanelSection.css';

import IconButton from 'experimental/components/IconButton.js';
import TinyDownIcon from 'components/iconset/TinyDownIcon.js';
import TinyUpIcon from 'components/iconset/TinyUpIcon.js';

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
        this.setState((prev, props) => 
        {
            return { open: !prev.open };
        });
    }

    /** @override */
    componentDidUpdate()
    {
        if (this.state.open && this.props.disabled)
        {
            this.setState({ open: false });
        }
    }

    /** @override */
    render()
    {
        const isOpen = this.state.open;
        const isDisabled = this.props.disabled || React.Children.count(this.props.children) <= 0;
        const isFull = this.props.full;
        const title = this.props.title;
        return (
            <section id={this.props.id}
                className={Style.section_container +
                    ' ' + this.props.className}
                style={this.props.style}>
                <IconButton className={Style.section_header}
                    title={title}
                    disabled={isDisabled}
                    onClick={this.onClick}>
                    {!isOpen ? <TinyDownIcon /> : <TinyUpIcon />}
                </IconButton>
                <div className={Style.section_content_container +
                    (isOpen ? ' open ' : '') +
                    (isFull ? ' full ' : '')}>
                    <div className={Style.section_content}>
                        {this.props.children}
                    </div>
                </div>
            </section>
        );
    }
}

export default PanelSection;
