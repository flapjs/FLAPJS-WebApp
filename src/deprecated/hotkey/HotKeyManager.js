export const CTRL_KEY = 'Control';
export const META_KEY = 'Meta';
export const ALT_KEY = 'Alt';
export const SHIFT_KEY = 'Shift';
// NOTE: For more keys, refer to http://keycode.info/

class HotKeyManager
{
    constructor()
    {
        this._hotkeys = [];
        this._cachedEvent = {
            ctrlKey: false,
            metaKey: false,
            altKey: false,
            shiftKey: false,
            code: null
        };
        this._prevHotKey = null;
        this._repeatCount = 0;
        this._enabled = false;

        this._altHotkey = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.provider = null;
    }

    bindProviderContext(provider)
    {
        this.provider = provider;
    }

    updateProviderContext()
    {
        if (this.provider && this.provider.shouldUpdateAsync)
        {
            this.provider.setState({ value: JSON.stringify(this._cachedEvent) });
        }
    }

    initialize()
    {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        this._enabled = true;
    }

    terminate()
    {
        this._enabled = false;

        this._prevHotKey = null;
        this._repeatCount = 0;
        this._hotkeys.length = 0;
        this._altHotkey = null;

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    registerHotKey(name, keys, callback)
    {
        if (!Array.isArray(keys)) throw new Error('Must be an array of key codes');
        const ctrlIndex = keys.indexOf(CTRL_KEY);
        if (ctrlIndex >= 0) keys.splice(ctrlIndex, 1);
        const metaIndex = keys.indexOf(META_KEY);
        if (metaIndex >= 0) keys.splice(metaIndex, 1);
        const altIndex = keys.indexOf(ALT_KEY);
        if (altIndex >= 0) keys.splice(altIndex, 1);
        const shiftIndex = keys.indexOf(SHIFT_KEY);
        if (shiftIndex >= 0) keys.splice(shiftIndex, 1);
        if (keys.length != 1) throw new Error('Multiple key operations not supported');
        const charKey = keys[0];

        const ctrl = ctrlIndex >= 0 || metaIndex >= 0;
        const alt = altIndex >= 0;
        const shift = shiftIndex >= 0;

        const result = {
            name: name,
            localizedKeys: (ctrl ? 'Ctrl + ' : '') +
                (alt ? 'Alt + ' : '') +
                (shift ? 'Shift + ' : '') +
                charKey,
            charKey: charKey,
            ctrlKey: ctrl,
            altKey: alt,
            shiftKey: shift,
            callback: callback
        };

        this._hotkeys.unshift(result);

        return this;
    }

    //HACK: Cause hotkey manager does not allow 'control' hotkeys. This is the exception.
    registerAltHotKey(name, callback)
    {
        if (this._altHotkey) throw new Error('Only one hotkey can exist for \'Alt\'');

        this._altHotkey = {
            name: name,
            localizedKeys: 'Alt',
            charKey: null,
            ctrlKey: false,
            altKey: true,
            shiftKey: false,
            callback: callback
        };

        return this;
    }

    setEnabled(enabled)
    {
        this._enabled = enabled;
        this.updateProviderContext();
    }

    isEnabled()
    {
        return this._enabled;
    }

    findMatchingHotKey(e)
    {
        for (const hotkey of this._hotkeys)
        {
            if (matchesHotKeyEvent(e, hotkey)) return hotkey;
        }
        return null;
    }

    getCurrentHotKey()
    {
        return this._prevHotKey;
    }

    getCurrentHotKeyRepeatCount()
    {
        return this._repeatCount;
    }

    getCurrentlyPossibleHotKeys(dst = [])
    {
        const event = this._cachedEvent;
        const eventCtrl = event.ctrlKey || event.metaKey;
        const eventAlt = event.altKey;
        const eventShift = event.shiftKey;
        if (!eventCtrl && !eventAlt && !eventShift) return dst;
        const eventKey = event.code;

        let result = null;
        for (const hotkey of this._hotkeys)
        {
            let flag = false;
            if (eventCtrl ^ hotkey.ctrlKey)
            {
                //It's ok, but it is not a complete match...
                if (!eventCtrl) flag = true;
                //Nope.
                else continue;
            }
            if (eventAlt ^ hotkey.altKey)
            {
                //It's ok, but it is not a complete match...
                if (!eventAlt) flag = true;
                //Nope.
                else continue;
            }
            if (eventShift ^ hotkey.shiftKey)
            {
                //It's ok, but it is not a complete match...
                if (!eventShift) flag = true;
                //Nope.
                else continue;
            }

            if (!flag && eventKey === hotkey.charKey)
            {
                result = hotkey;
            }

            dst.push(hotkey);
        }

        if (result) return result;
        else return dst;
    }

    onKeyDown(e)
    {
        if (!this._enabled) return;

        // As long as it's not an input-like element (cause they have their own hotkeys)
        if (document.activeElement instanceof HTMLInputElement) return;
        if (document.activeElement instanceof HTMLTextAreaElement) return;
        if (document.activeElement.hasAttribute('contenteditable')) return;

        if (!e.repeat)
        {
            this.captureKeyEvent(e, false);

            let result = this.findMatchingHotKey(this._cachedEvent);
            if (!result && matchesHotKeyEvent(e, this._altHotkey)) result = this._altHotkey;

            if (result)
            {
                if (this._prevHotKey === result)
                {
                    ++this._repeatCount;
                }
                else
                {
                    this._prevHotKey = result;
                    this._repeatCount = 0;
                }

                result.callback();
                this.updateProviderContext();

                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    onKeyUp(e)
    {
        if (!this._enabled) return;

        if (this.captureKeyEvent(e, true))
        {
            this._prevHotKey = null;
            this._repeatCount = 0;
        }
    }

    captureKeyEvent(e, isKeyUp = false)
    {
        this._cachedEvent.ctrlKey = e.ctrlKey;
        this._cachedEvent.metaKey = e.metaKey;
        this._cachedEvent.altKey = e.altKey;
        this._cachedEvent.shiftKey = e.shiftKey;
        this._cachedEvent.code = isKeyUp ? null : (e.code || null);
        return isKeyUp && !(this._cachedEvent.ctrlKey || this._cachedEvent.metaKey || this._cachedEvent.altKey || this._cachedEvent.shiftKey);
    }
}

export default HotKeyManager;

function matchesHotKeyEvent(e, hotkey)
{
    if (hotkey.ctrlKey !== (e.ctrlKey || e.metaKey)) return false;
    if (hotkey.altKey !== e.altKey) return false;
    if (hotkey.shiftKey !== e.shiftKey) return false;
    if (hotkey.charKey && hotkey.charKey !== e.code) return false;
    return true;
}
