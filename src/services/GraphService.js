import AbstractService from './AbstractService.js';

import InputController from '@flapjs/systems/graph/controller/InputController.js';
import ViewController from '@flapjs/systems/graph/controller/ViewController.js';

import SafeUndoNodeGraphEventHandler from '@flapjs/systems/graph/controller/SafeUndoNodeGraphEventHandler.js';
import GraphAutoSaveHandler from '@flapjs/systems/graph/controller/GraphAutoSaveHandler.js';

class GraphService extends AbstractService
{
    constructor()
    {
        super();

        this.graph = null;
        this.graphParser = null;
        this.graphControllerClass = null;

        this._autoSaveService = null;
        this._undoService = null;

        this.graphController = null;
        this.inputController = new InputController();
        this.viewController = new ViewController();

        this._onGraphChange = null;
        this._onInputChange = null;
        this._onViewChange = null;
    }

    setGraph(graph)
    {
        this.graph = graph;
        return this;
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

    extendAutoSaveService(autoSaveService)
    {
        this._autoSaveService = autoSaveService;
        return this;
    }

    extendUndoService(undoService)
    {
        this._undoService = undoService;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        if (!this.graph) throw new Error('Mising graph - must call setGraph() before session load()');
        if (!this.graphControllerClass) throw new Error('Mising graph controller class - must call setGraphControllerClass() before session load()');

        this.graphController = new (this.graphControllerClass)(this.graph);
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
        this._onGraphChange = this.onGraphChange.bind(this, sessionProvider);
        this._onInputChange = this.onInputChange.bind(this, sessionProvider);
        this._onViewChange = this.onViewChange.bind(this, sessionProvider);
        sessionProvider.state.graphController.getGraphChangeHandler().addListener(this._onGraphChange);
        sessionProvider.state.inputController.getChangeHandler().addListener(this._onInputChange);
        sessionProvider.state.viewController.getChangeHandler().addListener(this._onViewChange);

        return this;
    }

    /** @override */
    unmount(sessionProvider)
    {
        super.unmount(sessionProvider);

        sessionProvider.state.graphController.getGraphChangeHandler().removeListener(this._onGraphChange);
        sessionProvider.state.inputController.getChangeHandler().removeListener(this._onInputChange);
        sessionProvider.state.viewController.getChangeHandler().removeListener(this._onViewChange);
        this._onGraphChange = null;
        this._onInputChange = null;
        this._onViewChange = null;

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.graph = null;
        this.graphController.terminate();
        this.inputController.terminate();
        this.viewController.terminate();

        delete session.graphController;
        delete session.inputController;
        delete session.viewController;

        return this;
    }

    onGraphChange(sessionProvider, graph, hash)
    {
        sessionProvider.setState({ graphHash: hash });
    }

    onViewChange(sessionProvider, viewport, hash)
    {
        sessionProvider.setState({ viewHash: hash });
    }

    onInputChange(sessionProvider, input, hash)
    {
        sessionProvider.setState({ inputHash: hash });
    }
}

export default GraphService;
