const ROUTER = {
    _componentClass: null,
    _componentProps: null,
    routeTo(componentClass, componentProps = {})
    {
        this._componentClass = componentClass;
        this._componentProps = componentProps;
    },
    getCurrentPage()
    {
        return this._componentClass;
    },
    getCurrentPageProps()
    {
        return this._componentProps;
    }
};

export default ROUTER;
