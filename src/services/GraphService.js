import AbstractService from './AbstractService.js';

import InputController from '@flapjs/systems/graph/controller/InputController.js';
import ViewController from '@flapjs/systems/graph/controller/ViewController.js';

import SafeUndoNodeGraphEventHandler from '@flapjs/systems/graph/controller/SafeUndoNodeGraphEventHandler.js';
import GraphAutoSaveHandler from '@flapjs/systems/graph/controller/GraphAutoSaveHandler.js';

class GraphService extends AbstractService
{
    static get SERVICE_KEY() { return 'graphService'; }
    
    constructor()
    {
        super();

        this.graphParser = null;
        this.graphControllerClass = null;

        this._autoSaveService = null;
        this._undoService = null;

        this.graphController = null;
        this.inputController = new InputController();
        this.viewController = new ViewController();

        this._onGraphControllerChange = null;
        this._onInputControllerChange = null;
        this._onViewControllerChange = null;
    }

    setGraphParser(graphParser)
    {
        this.graphParser = graphParser;
        return this;
    }

    setGraphControllerClass(graphControllerClass)
    {
        this.graphControllerClass = graphControllerClass;
        return this;
    }

    enableAutoSaveServiceFeatures(autoSaveService)
    {
        this._autoSaveService = autoSaveService;
        return this;
    }

    enableUndoServiceFeatures(undoService)
    {
        this._undoService = undoService;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        if (!this.graphControllerClass) throw new Error('Mising graph controller class - must call setGraphControllerClass() before session load()');

        this.graphController = new (this.graphControllerClass)();
        this.graphController.setSession(session);

        this.viewController.initialize();
        this.inputController.initialize();
        this.graphController.initialize();

        session.graphController = this.graphController;
        session.inputController = this.inputController;
        session.viewController = this.viewController;

        if (this.graphParser)
        {
            if (this._undoService) this._undoService.undoManager.setEventHandlerFactory(() => new SafeUndoNodeGraphEventHandler(this.graphController, this.graphParser));
            if (this._autoSaveService) this._autoSaveService.registerAutoSaveHandler(new GraphAutoSaveHandler(session));
        }
        else if (this._undoService || this._autoSaveService)
        {
            throw new Error('Mising graph parser for extended services - must call setGraphParser() before session load()');
        }
        
        return this;
    }

    /** @override */
    mount(sessionProvider)
    {
        super.mount(sessionProvider);

        // HACK: This forces everything to re-render every time something either in the
        // graph, input, or view changes.
        // This is pretty bad practice. If something depends on one of those 3 things,
        // they should register themselves with that controller's change handler.
        this._onGraphControllerChange = this.onGraphControllerChange.bind(this, sessionProvider);
        this._onInputControllerChange = this.onInputControllerChange.bind(this, sessionProvider);
        this._onViewControllerChange = this.onViewControllerChange.bind(this, sessionProvider);
        sessionProvider.state.graphController.getChangeHandler().addChangeListener(this._onGraphControllerChange);
        sessionProvider.state.inputController.getChangeHandler().addChangeListener(this._onInputControllerChange);
        sessionProvider.state.viewController.getChangeHandler().addChangeListener(this._onViewControllerChange);

        return this;
    }

    /** @override */
    unmount(sessionProvider)
    {
        super.unmount(sessionProvider);

        sessionProvider.state.graphController.getChangeHandler().removeChangeListener(this._onGraphControllerChange);
        sessionProvider.state.inputController.getChangeHandler().removeChangeListener(this._onInputControllerChange);
        sessionProvider.state.viewController.getChangeHandler().removeChangeListener(this._onViewControllerChange);
        this._onGraphControllerChange = null;
        this._onInputControllerChange = null;
        this._onViewControllerChange = null;

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this._undoService = null;
        this._autoSaveService = null;

        this.graphController.terminate();
        this.inputController.terminate();
        this.viewController.terminate();

        delete session.graphController;
        delete session.inputController;
        delete session.viewController;

        return this;
    }

    onGraphControllerChange(sessionProvider, graphController, hash)
    {
        sessionProvider.setState({ graphHash: hash });
    }

    onViewControllerChange(sessionProvider, viewController, hash)
    {
        sessionProvider.setState({ viewHash: hash });
    }

    onInputControllerChange(sessionProvider, inputController, hash)
    {
        sessionProvider.setState({ inputHash: hash });
    }
}

export default GraphService;
