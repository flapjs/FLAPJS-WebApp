import React from 'react';
import Style from './App.module.css';

function App(props)
{
    return (
        <div className={Style.appContainer}>
            <div className={Style.appContent}>
                <div className={Style.appViewport}>
                    
                </div>
                <div className={Style.appDrawer}>
                    <div className={Style.drawerHandle}>
                        <span>{'||'}</span>
                    </div>
                    <div className={Style.drawerContent}>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
