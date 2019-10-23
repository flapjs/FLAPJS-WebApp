import React from 'react';
import PropTypes from 'prop-types';
import Style from './WorkspaceLayout.module.css';

/**
 * A React component that separates into 2 layers: foreground and background.
 * This is usally used with other layouts to provide an overlay over a
 * background, which will usually contain the editor playground.
 */
class WorkspaceLayout extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    
    /** @override */
    render()
    {
        const props = this.props;
        
        const renderForeground = props.renderForeground;
        const renderBackground = props.renderBackground;
        
        return (
            <section ref={this.container}
                className={Style.container + ' ' + (props.className || '')}>
                <div className={Style.background}>
                    {renderBackground && renderBackground(this)}
                </div>
                {props.children}
                <div className={Style.foreground}>
                    {renderForeground && renderForeground(this)}
                </div>
            </section>
        );
    }
}

WorkspaceLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    renderForeground: PropTypes.func,
    renderBackground: PropTypes.func,
};
WorkspaceLayout.defaultProps = {
};

export default WorkspaceLayout;
