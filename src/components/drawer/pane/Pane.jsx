import React from 'react';
import PropTypes from 'prop-types';
import Style from './Pane.module.css';

import { TinyDownIcon } from '@flapjs/components/icons/Icons.js';

/**
 * A React component that can do anything you want :D.
 */
class Pane extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            open: true
        };

        this.onHeaderClick = this.onHeaderClick.bind(this);
    }

    onHeaderClick(e)
    {
        this.setState(prev =>
        {
            return {
                open: !prev.open
            };
        });
    }

    /** @override */
    render()
    {
        const props = this.props;
        const state = this.state;

        const open = state.open;
        
        return (
            <section className={Style.container
                + ' ' + (props.className || '')
                + (open ? ' open': '')}>
                <header>
                    <button className={Style.dropdown} onClick={this.onHeaderClick}>
                        <span className={Style.title}>
                            {props.title}
                        </span>
                        <TinyDownIcon className="icon" />
                    </button>
                </header>
                <main>
                    {props.children}
                </main>
            </section>
        );
    }
}

Pane.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
};
Pane.defaultProps = {
};

export default Pane;
