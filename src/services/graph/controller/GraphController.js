import { DEFAULT_LABEL_FORMATTER } from './LabelFormatter.js';

import GraphNode from '../model/elements/GraphNode.js';
import GraphEdge from '../model/elements/GraphEdge.js';
import AbstractController from '@flapjs/services/graph/controller/AbstractController.js';

export const GRAPH_EVENT_CLEAR = 'graph-clear';
export const EVENT_ON_CHANGE_GRAPH = 'changegraph';

class GraphController extends AbstractController
{
    constructor(graph)
    {
        super();

        this._graph = graph;

        this._labelEditor = null;
        this._labelFormatter = null;
    }

    setLabelEditor(labelEditor)
    {
        this._labelEditor = labelEditor;
        return this;
    }

    setLabelFormatter(labelFormatter)
    {
        this._labelFormatter = labelFormatter;
        return this;
    }

    /** @override */
    terminate()
    {
        super.terminate();
        this.clearGraph();
    }

    /** @override */
    getControlledHashCode(self)
    {
        return self._graph.getHashCode(false);
    }

    clearGraph()
    {
        // FIXME: Get the actual localized version of this string...
        // if (window.confirm('Are you sure you want to clear the graph?'/* I18N.toString('alert.graph.clear') */))
        {
            this._graph.clear();
            this.emitGraphEvent(GRAPH_EVENT_CLEAR);
        }
    }

    emitGraphEvent(eventName, eventData = {})
    {
        this._changeHandler.update();
    }

    openLabelEditor(target, defaultLabel = null, callback = null)
    {
        if (!this._labelEditor)
        {
            if (callback) callback(target, defaultLabel, false);
            return;
        }

        const labelEditor = this._labelEditor;
        const prevLabel = defaultLabel || '';
        labelEditor.openEditor(target, defaultLabel, (target, value) =>
        {
            const hasChanged = !prevLabel || (prevLabel.length > 0 && value !== prevLabel);
            if (target instanceof GraphEdge)
            {
                target.setEdgeLabel(value);
            }
            else if (target instanceof GraphNode)
            {
                target.setNodeLabel(value);
            }

            if (callback) callback(target, value, hasChanged);
        }, (target) =>
        {
            if (callback) callback(target, null, false);
        });
    }

    getLabelFormatter() { return this._labelFormatter || DEFAULT_LABEL_FORMATTER; }
    getLabelEditor() { return this._labelEditor; }
    getGraph() { return this._graph; }

    /**
     * Use getChangeHandler().addChangeListener() instead.
     * 
     * @deprecated
     * @param {Function} listener The listener to listen for the changegraph event.
     * @returns {this} For method-chaining.
     */
    addListener(listener)
    {
        this._changeHandler.addChangeListener(listener);
        return this;
    }

    /**
     * Use getChangeHandler().removeChangeListener() instead.
     * 
     * @deprecated
     * @param {Function} listener The listener to remove for the changegraph event.
     * @returns {this} For method-chaining.
     */
    removeListener(listener)
    {
        this._changeHandler.removeChangeListener(listener);
        return this;
    }

    /**
     * Use getChangeHandler() instead.
     * 
     * @deprecated
     * @returns {ControllerChangeHandler} The change handler for the graph.
     */
    getGraphChangeHandler() { return this.getChangeHandler(); }
}

export default GraphController;
