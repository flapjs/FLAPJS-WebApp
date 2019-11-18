import React from 'react';
import PropTypes from 'prop-types';
// import Style from './Toolbar.module.css';

import ToolbarDropdown from '@flapjs/components/topbar/toolbar/dropdown/ToolbarDropdown.jsx';

/**
 * A React component that can do anything you want. :D.
 * Heavily inspired by https://blog.logrocket.com/building-a-custom-dropdown-menu-component-for-react-e94f02ced4a1/.
 */
class Toolbar extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            file: [
                {
                    id: 0,
                    title: 'New',
                    selected: false,
                    key: 'file',
                    options: [
                        {
                            id: 3,
                            title: 'DFA',
                            selected: false,
                            key: 'file/new'
                        },
                        {
                            id: 4,
                            title: 'NFA',
                            selected: false,
                            key: 'file/new'
                        },
                        {
                            id: 5,
                            title: 'PDA',
                            selected: false,
                            key: 'file/new'
                        }
                    ]
                },
                {
                    id: 1,
                    title: 'Open',
                    selected: false,
                    key: 'file'
                },
                {
                    id: 2,
                    title: 'Save',
                    selected: false,
                    key: 'file'
                }
            ]
        };
        this.toggleSelected = this.toggleSelected.bind(this);
    }

    toggleSelected(id, key) 
    {
        let selection = this.state[key];
        selection[id].selected = !selection[id].selected;
        this.setState({
            [key]: selection
        });
    }

    /** @override */
    render()
    {
        const props = this.props;
        
        return (
            <div className={props.className}>
                <ToolbarDropdown
                    title="File"
                    list={this.state.file}
                    toggleItem={this.toggleSelected}
                />
            </div>
        );
    }
}

Toolbar.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};
Toolbar.defaultProps = {
};

export default Toolbar;
