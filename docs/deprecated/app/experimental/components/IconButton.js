import React from 'react';
import Style from './IconButton.css';

class IconButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const { refButton, title, className, ...props } = this.props;
        const showButtonLabel = IconButton.SHOW_LABEL && title;

        return (
            <button {...props}
                ref={refButton}
                className={Style.icon_button +
                    (showButtonLabel ? ' hint ' : '') +
                    ' ' + className}
                title={title}>
                {this.props.children}
                <label>{title}</label>
            </button>
        );
    }
}
IconButton.SHOW_LABEL = false;

export default IconButton;
