import React from 'react';
import PropTypes from 'prop-types';
import Style from './ToolbarDropdown.module.css';

import ToolbarDropdownOptions from '@flapjs/components/topbar/toolbar/dropdown/ToolbarDropdownOptions.jsx';

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
        this.node = React.createRef();
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
        if ((this.node.current.contains(e.target) && !this.state.listOpen)) 
        {
            this.setState({
                listOpen: true
            });
        }
        else 
        {
            this.setState({
                listOpen: false
            });
        }
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
                ref = {this.node}
                className={Style.container}
            >
                {/* <button className="dd-header" onClick={e => this.handleClick(e)}> */}
                <button>
                    <div>{props.title}</div>
                    {/* {listOpen ? <p>up</p> : <p>down</p>} */}
                </button>
                {listOpen && 
                // {true && 
                <ul className={Style.dropdownlist}>
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
                                        onMouseDown={() => {props.toggleItem(item.id, item.key);}}>
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

ToolbarDropdown.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.array,
    toggleItem: PropTypes.func
};
ToolbarDropdown.defaultProps = {
};

export default ToolbarDropdown;
