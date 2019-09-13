import React from 'react';
import PropTypes from 'prop-types';

import Pane from '../../panel/pane/Pane.jsx';

function AppDrawer(props)
{
    return (
        <div className={props.className || ''} style={{color: 'white', width: '100%', height: '100%'}}>
            {
                /*
                    <ColorPane source={() => document.querySelector('#root')}>
                    </ColorPane>
                    <Pane title="About" open={true}>
                        <p>I am content :D</p>
                        <ThemeStyleList/>
                    </Pane>
                */
            }
            <Pane title="Hello World" open={true}>
                <p>I am content :D</p>
                <p>
                    Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                </p>
                <p>
                    Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                </p>
            </Pane>
            <Pane title="Nothing To See Here" open={true}>
                <p>I am content :D</p>
                <p>
                    Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                </p>
                <p>
                    Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                </p>
            </Pane>
            {props.children}
        </div>
    );
}
AppDrawer.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default AppDrawer;
