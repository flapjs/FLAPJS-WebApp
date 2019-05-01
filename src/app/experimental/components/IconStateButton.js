import React from 'react';
import IconButton from './IconButton.js';

class IconStateButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            index: props.initial || 0
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        const prevIndex = this.state.index;
        this.setState((prev, props) => 
        {
            const count = React.Children.count(props.children);
            let nextIndex = prev.index + 1;
            if (nextIndex >= count)
            {
                nextIndex = 0;
            }
            return {index: nextIndex};
        }, () => 
        {
            if (this.props.onClick)
            {
                this.props.onClick(e, prevIndex);
            }
        });
    }

    setStateIndex(index)
    {
        this.setState({index: index});
    }

    getStateIndex()
    {
        return this.state.index;
    }

    /** @override */
    render()
    {
        const child = React.Children.map(this.props.children, (child, i) => 
        {
            if (i === this.state.index) return child;
        })[0];

        return (
            <IconButton id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={this.props.title}
                disabled={this.props.disabled}
                onClick={this.onClick}>
                {child}
            </IconButton>
        );
    }
}
export default IconStateButton;
