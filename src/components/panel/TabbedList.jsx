import React from 'react';
import PropTypes from 'prop-types';
import Style from './TabbedList.module.css';

function TabbedList(props)
{
    const {panels, /* tabIndex, */ setTabIndex} = props;

    const result = [];

    React.Children.forEach(panels, (child, index) =>
    {
        result.push(
            <button
                key={index + ':' + child.props.title}
                onClick={() => setTabIndex(index)}>
                {
                    child.props.renderTab
                        ? child.props.renderTab()
                        : child.props.title
                }
            </button>
        );
    });

    return (
        <div className={Style.container + ' ' + (props.className || '')}
            style={{ flexDirection: props.direction }}>
            {result}
        </div>
    );
}
TabbedList.propTypes = {
    className: PropTypes.string,
    direction: PropTypes.oneOf([
        'row',
        'column'
    ]),
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
    panels: PropTypes.arrayOf(PropTypes.element),
};

export default TabbedList;
