class ViewportManager
{
    constructor()
    {
        this._viewClasses = [];
        this._viewProps = null;
    }

    setViewProps(props)
    {
        this._viewProps = props;
        return this;
    }

    addViewClass(viewClass)
    {
        this._viewClasses.push(viewClass);
        return this;
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {

    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        this._viewClasses.length = 0;
        this._viewProps = null;
    }

    getViewProps()
    {
        return this._viewProps;
    }

    getViewClasses()
    {
        return this._viewClasses;
    }
}

export default ViewportManager;
