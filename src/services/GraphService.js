import AbstractService from './AbstractService.js';

import InputController from '@flapjs/services/graph/controller/InputController.js';
import ViewController from '@flapjs/services/graph/controller/ViewController.js';

import SafeUndoNodeGraphEventHandler from '@flapjs/services/graph/controller/SafeUndoNodeGraphEventHandler.js';
import GraphAutoSaveHandler from '@flapjs/services/graph/controller/GraphAutoSaveHandler.js';
import { createServiceContext } from '@flapjs/services/util/ServiceContextFactory.js';

class GraphService extends AbstractService
{
    /** @override */
    static get SERVICE_KEY() { return 'graphService'; }
    
    constructor()
    {
        super();

        this.graphParser = null;
        this.graphControllerClass = null;

        this.graphController = null;
        this.inputController = new InputController();
        this.viewController = new ViewController();

        this._autoSaveService = null;
        this._undoService = null;

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
    onServiceLoad(state)
    {
        state.graphController = this.graphController;
        state.inputController = this.inputController;
        state.viewController = this.viewController;
    }

    /** @override */
    onServiceMount(provider)
    {
        // HACK: This forces everything to re-render every time something either in the
        // graph, input, or view changes.
        // This is pretty bad practice. If something depends on one of those 3 things,
        // they should register themselves with that controller's change handler.
        this._onGraphControllerChange = this.onGraphControllerChange.bind(this, provider);
        this._onInputControllerChange = this.onInputControllerChange.bind(this, provider);
        this._onViewControllerChange = this.onViewControllerChange.bind(this, provider);
        provider.state.graphController.getChangeHandler().addChangeListener(this._onGraphControllerChange);
        provider.state.inputController.getChangeHandler().addChangeListener(this._onInputControllerChange);
        provider.state.viewController.getChangeHandler().addChangeListener(this._onViewControllerChange);
    }

    /** @override */
    onServiceUnmount(provider)
    {
        provider.state.graphController.getChangeHandler().removeChangeListener(this._onGraphControllerChange);
        provider.state.inputController.getChangeHandler().removeChangeListener(this._onInputControllerChange);
        provider.state.viewController.getChangeHandler().removeChangeListener(this._onViewControllerChange);
        this._onGraphControllerChange = null;
        this._onInputControllerChange = null;
        this._onViewControllerChange = null;
    }

    /** @override */
    onServiceUnload(state)
    {
        delete state.graphController;
        delete state.inputController;
        delete state.viewController;
    }

    /** @override */
    onSessionLoad(session)
    {
        if (!this.graphControllerClass) throw new Error('Mising graph controller class - must call setGraphControllerClass() before session load()');

        this.graphController = new (this.graphControllerClass)();
        this.graphController.setSession(session);

        this.viewController.initialize();
        this.inputController.initialize();
        this.graphController.initialize();

        if (this.graphParser)
        {
            if (this._undoService) this._undoService.undoManager.setEventHandlerFactory(() => new SafeUndoNodeGraphEventHandler(this.graphController, this.graphParser));
            if (this._autoSaveService) this._autoSaveService.registerAutoSaveHandler(new GraphAutoSaveHandler(session));
        }
        else if (this._undoService || this._autoSaveService)
        {
            throw new Error('Mising graph parser for extended services - must call setGraphParser() before session load()');
        }
    }

    /** @override */
    onSessionUnload(session)
    {
        this._undoService = null;
        this._autoSaveService = null;

        this.graphController.terminate();
        this.inputController.terminate();
        this.viewController.terminate();
    }

    onGraphControllerChange(provider, graphController, hash)
    {
        provider.setState({ graphHash: hash });
    }

    onViewControllerChange(provider, viewController, hash)
    {
        provider.setState({ viewHash: hash });
    }

    onInputControllerChange(provider, inputController, hash)
    {
        provider.setState({ inputHash: hash });
    }
}
GraphService.INSTANCE = new GraphService();
GraphService.CONTEXT = createServiceContext('GraphService', GraphService.INSTANCE);

export default GraphService;
