import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

// import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import TitleInput from '@flapjs/components/topbar/title/TitleInput.jsx';

function AppBar(props)
{
    return (
        <nav className={Style.appbar + ' ' + (props.className || '')}>
            <h2>Flap.js</h2>
            <TitleInput className={Style.apptitle} changeModule={props.changeModule}></TitleInput>
            {props.children}
        </nav>
    );
}
AppBar.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    changeModule: PropTypes.func.isRequired,
};

export default AppBar;
