/* eslint-disable */
import React from 'react';
export const withFullscreen = story => (<div>
    <style>{`.sb-show-main { margin: 0; }`}</style>
    <div style={{ width: '100vw', height: '100vh' }}>
        {story()}
    </div>
</div>);
