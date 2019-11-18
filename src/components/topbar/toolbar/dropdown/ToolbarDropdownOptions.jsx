import React from 'react';
import PropTypes from 'prop-types';
import Style from './ToolbarDropdownOptions.module.css';

/**
 * A React component that can do anything you want. :D.
 */
class ToolbarDropdownOptions extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            listOpen: false,
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseOver()
    {
        this.setState({
            listOpen: true
        });
    }

    handleMouseLeave()
    {
        this.setState({
            listOpen: false
        });
    }

    /** @override */
    render()
    {
        const props = this.props;
        const { listOpen } = this.state;

        return (
            <div
                id={props.id}
                style={props.style}
                // ref={node => this.node = node}
                className={Style.container}
                onBlur={() => this.handleMouseLeave()}
                onFocus={() => this.handleMouseOver()}
                onMouseOver={() => this.handleMouseOver()}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                {/* <button className="dd-header" onClick={() => this.toggleList()}> */}
                <button>
                    <div>{props.title}</div>
                    {/* {listOpen ? <p>up</p> : <p>down</p>} */}
                </button>
                {listOpen &&
                    <ul className={Style.dropdownOptions}>
                        {props.list.map((item) => (
                            <li key={item.id}>
                                {
                                    item.options ?
                                        <ToolbarDropdownOptions
                                            title={item.title}
                                            list={item.options}
                                            toggleItem={props.toggleItem}
                                        />
                                        :
                                        <button
                                            onMouseDown={() => { props.toggleItem(item.id, item.key); }}>
                                            {item.title}
                                            {item.selected && <p>x</p>}
                                        </button>
                                }
                            </li>
                        ))}
                    </ul>}
            </div>
        );
    }
}

ToolbarDropdownOptions.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.array,
    toggleItem: PropTypes.func
};
ToolbarDropdownOptions.defaultProps = {
};

export default ToolbarDropdownOptions;
