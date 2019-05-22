import React from 'react';
import Style from './HotKeyView.css';

const AVAILABLE_HOTKEY_REFRESH_RATE = 100;

class HotKeyView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._cachedHotKeys = [];
        this._cacheTimeout = null;
    }

    /** @override */
    render()
    {
        const hotKeyManager = this.props.hotKeyManager;
        const showHotKeys = !this.props.disabled && hotKeyManager.isEnabled();

        if (!this._cacheTimeout && showHotKeys)
        {
            this._cacheTimeout = setTimeout(() => 
            {
                this._cacheTimeout = null;
                this._cachedHotKeys.length = 0;
                hotKeyManager.getCurrentlyPossibleHotKeys(this._cachedHotKeys);
            }, AVAILABLE_HOTKEY_REFRESH_RATE);
        }

        const useCount = hotKeyManager.getCurrentHotKeyRepeatCount();
        const currentHotKey = hotKeyManager.getCurrentHotKey();

        return (
            <div id={this.props.id}
                className={Style.hotkey_container +
          ' ' + this.props.className}
                style={this.props.style}>
                {showHotKeys && this._cachedHotKeys.map((e, i) => 
                {
                    const isActive = currentHotKey === e;
                    return (
                        <div key={e.localizedKeys + ':' + i + ':' + (isActive ? useCount : 0)}
                            className={Style.hotkey +
                (isActive ? ' active ' : '')}>
                            <label className={Style.hotkey_label}>
                                {e.localizedKeys}
                            </label>
                            <label className={Style.hotkey_name}>
                                {e.name + (isActive && useCount > 1 ? ' x' + useCount : '')}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default HotKeyView;
