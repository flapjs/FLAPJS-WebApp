import AbstractService from './AbstractService.js';

import NodeGraphController from '@flapjs/modules/base/NodeGraphController.js';
import InputController from '@flapjs/systems/graph/controller/InputController.js';
import ViewController from '@flapjs/systems/graph/controller/ViewController.js';

class GraphService extends AbstractService
{
    constructor()
    {
        super();

        this.graph = null;
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

    /** @override */
    load(session)
    {
        super.load(session);

        this.graphController = new NodeGraphController(this.graph);
        this.graphController.setSession(session);

        this.viewController.initialize();
        this.inputController.initialize();
        this.graphController.initialize();

        session.graphController = this.graphController;
        session.inputController = this.inputController;
        session.viewController = this.viewController;
        
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
