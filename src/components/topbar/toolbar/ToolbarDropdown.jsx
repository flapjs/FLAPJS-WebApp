import React from 'react';
import PropTypes from 'prop-types';
// import Style from './ToolbarDropdown.module.css';

/**
 * A React component that can do anything you want. :D.
 *
 * @param e
 */
class ToolbarDropdown extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            listOpen: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    /** @override */
    componentDidMount() 
    {
        document.addEventListener('mousedown', this.handleClick, false);
    }
    
    /** @override */
    componentWillUnmount() 
    {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick(e)
    {
        if (this.node.contains(e.target)) 
        {
            return;
        }
        this.handleClickOutside();
    }

    handleClickOutside() 
    {
        this.setState({
            listOpen: false
        });
    }

    toggleList() 
    {
        this.setState(prevState => ({
            listOpen: !prevState.listOpen
        }));
    }

    /** @override */
    render()
    {
        const props = this.props;
        const{ listOpen } = this.state;

        return (
            <div
                id={props.id}
                style={props.style}
                ref = {node => this.node = node}
                className={props.className}
            >
                <button className="dd-header" onClick={() => this.toggleList()}>
                    <div className="dd-header-title">{props.title}</div>
                    {/* {listOpen ? <p>up</p> : <p>down</p>} */}
                </button>
                {listOpen && 
                <ul className="dd-list">
                    {props.list.map((item) => (
                        <li key={item.id}>
                            <button
                                className="dd-list-item"
                                onClick={() => {props.toggleItem(item.id, item.key);}}>
                                {item.title}
                                {item.selected && <p>x</p>}
                            </button>
                        </li>
                    ))}
                </ul>}
            </div>
        );
    }
}

ToolbarDropdown.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        selected: PropTypes.bool,
        key: PropTypes.string
    })),
    toggleItem: PropTypes.func
};
ToolbarDropdown.defaultProps = {
};

export default ToolbarDropdown;
