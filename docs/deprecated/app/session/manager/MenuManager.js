class MenuManager
{
    constructor()
    {
        this._panelClasses = [];
        this._panelProps = null;
        this._subtitleComponentClass = null;
    }

    setSubtitleComponentClass(componentClass)
    {
        this._subtitleComponentClass = componentClass;
    }

    setPanelProps(props)
    {
        this._panelProps = props;
        return this;
    }

    addPanelClass(panelClass)
    {
        this._panelClasses.push(panelClass);
        return this;
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {
    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        session.getApp().getToolbarComponent().closeBar();
    
        this._panelClasses.length = 0;
        this._panelProps = null;
    }

    getPanelProps()
    {
        return this._panelProps;
    }

    getPanelClasses()
    {
        return this._panelClasses;
    }

    getSubtitleComponentClass()
    {
        return this._subtitleComponentClass;
    }
}

export default MenuManager;
