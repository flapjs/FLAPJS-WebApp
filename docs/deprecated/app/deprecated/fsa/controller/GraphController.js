import AbstractGraphController from 'modules/abstract/AbstractGraphController.js';
import GraphImageExporter from '../exporter/GraphImageExporter.js';
import { FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_SVG } from 'util/Downloader.js';

import GraphImporter from './GraphImporter.js';

import Eventable from 'util/Eventable.js';
import GraphLayout from 'deprecated/fsa/graph/GraphLayout.js';
import FSAGraph from 'deprecated/fsa/graph/FSAGraph.js';
import FSAGraphLabeler from 'deprecated/fsa/graph/FSAGraphLabeler.js';
import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

import GraphChangeHandler from 'experimental/GraphChangeHandler.js';

import FSAGraphExporter from 'deprecated/fsa/exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from 'deprecated/fsa/exporter/JFLAPGraphExporter.js';

export const DEFAULT_IMAGE_EXPORTERS = [
    new GraphImageExporter(FILE_TYPE_PNG),
    new GraphImageExporter(FILE_TYPE_JPG),
    new GraphImageExporter(FILE_TYPE_SVG)
];

const EXPORTERS = [
    new FSAGraphExporter(),
    new JFLAPGraphExporter()
];

const NODE_SPAWN_RADIUS = 64;
const DEFAULT_AUTO_RENAME = true;
const GRAPH_REFRESH_RATE = 30;

class GraphController extends AbstractGraphController
{
    constructor(module)
    {
        super(module, new FSAGraph(), new FSAGraphLabeler(), FSAGraphParser);

        this._importer = new GraphImporter(module);

        this._labeler.setGraphController(this);

        this.inputController = null;
        this.machineController = null;
        this._graphChangeHandler = new GraphChangeHandler(GRAPH_REFRESH_RATE);

        this.labelEditorElement = null;
        this.tester = null;

        this.prevQuad = {
            radians: 0, length: 0,
            x: 0, y: 0
        };
        this.prevEdgeTo = null;
        this.prevX = 0;
        this.prevY = 0;


        this.shouldAutoLabel = false;

        //The difference between controller events vs graph events is: controller has user-intent

        //userCreateNode(graph, node) - When user creates a node
        //this.registerEvent("userCreateNode");
        //this.registerEvent("userPreCreateNode");//(graph, nextNodeID, x, y)
        //this.registerEvent("userPostCreateNode");//(graph, node)

        //userToggleNode(graph, node, prevAccept) - When user toggles the accept state
        //this.registerEvent("userToggleNode");

        //userDeleteNodes(graph, node, targetNodes, prevX, prevY) - When user deletes one or more nodes
        //this.registerEvent("userDeleteNodes");
        //this.registerEvent("userPreDeleteNodes");
        //this.registerEvent("userPostDeleteNodes");

        //userDeleteEdge(graph, edge, prevTo, prevQuad) - When user deletes an edge
        //this.registerEvent("userDeleteEdge");
        //this.registerEvent("userPreDeleteEdge");
        //this.registerEvent("userPostDeleteEdge");

        //userCreateEdge(graph, edge) - When user creates an edge, after naming it
        //this.registerEvent("userCreateEdge");
        //this.registerEvent("userPreCreateEdge");
        //this.registerEvent("userPostCreateEdge");

        /*
    //userMoveNodes(graph, nodes, dx, dy) - When user moves one or more nodes
    this.registerEvent("userMoveNodes");
    //userMoveInitial(graph, node, prevNode) - When user moves the initial marker to another
    this.registerEvent("userMoveInitial");
    //userPreCreateEdge(graph, edge) - When user is about to create an edge, before src
    this.registerEvent("userPreCreateEdge");
    //userBeginEdge(graph, edge, src) - When user begins to create an edge, after src and before naming it
    this.registerEvent("userBeginEdge");
    //userEndEdge(graph, edge, src, dst) - When user finishes creating an edge, after dst and before naming it (dst could be null for deletion)
    this.registerEvent("userEndEdge");
    //userPostCreateEdge(graph, edge) - When user is finished creating an edge, after dst and after quad changes
    this.registerEvent("userPostCreateEdge");
    //userMoveEdge(graph, edge, prevDest) - When user changes the dst of edge
    this.registerEvent("userChangeEdge");
    //userBendEdge(graph, edge, prevQuad) - When user bends the edge
    this.registerEvent("userBendEdge");
    //userLabelEdge(graph, edge, prevLabel) - When user re-labels the edge
    this.registerEvent("userLabelEdge");
    */

        //userRenameNode(graph, node, nextLabel, prevLabel, isPrevCustom) - When user sets the label of node
        //this.registerEvent("userRenameNode");

        //userChangeLayout(graph, prevLayout) - When user re-layouts the graph
        //this.registerEvent("userChangeLayout");
        //this.registerEvent("userPreChangeLayout");//before any changes
        //this.registerEvent("userPostChangeLayout");//after all changes

        //userImportGraph(graph) - When user imports a graph
        //this.registerEvent("userImportGraph");
        //this.registerEvent("userPreImportGraph");//before any changes
        //this.registerEvent("userPostImportGraph");//after all changes

        //nodeMove(targetNode, nextX, nextY, prevX, prevY)
        //this.registerEvent("nodeMove");
        //nodeMoveAll(targetNodes, dx, dy)
        //this.registerEvent("nodeMoveAll");
        //nodeInitial(nextInitial, prevInitial)
        //this.registerEvent("nodeInitial");
        //edgeDestination(targetEdge, nextDestination, prevDestination, prevQuad)
        //this.registerEvent("edgeDestination");
        //edgeMove(targetEdge, nextQuad, prevQuad)
        //this.registerEvent("edgeMove");
        //edgeLabel(targetEdge, nextLabel, prevLabel)
        //this.registerEvent("edgeLabel");
        //tryCreateWhileTrash()
        this.registerEvent('tryCreateWhileTrash');
    }

    /** @override */
    initialize(module)
    {
        super.initialize(module);
        this.tester = module.getTestingManager();

        this.inputController = module.getInputController();
        this.machineController = module.getMachineController();

        this.setAutoRenameNodes(DEFAULT_AUTO_RENAME);
    }

    /** @override */
    destroy(module)
    {
        super.destroy(module);
    }

    /** @override */
    update(module)
    {
        super.update(module);

        this._graphChangeHandler.update(this._graph);
    }

    /** @override */
    getGraphExporters() { return EXPORTERS; }

    //TODO: From AbstractModule(but not for experimental)
    getDefaultGraphExporter()
    {
        const exporters = this.getGraphExporters();
        if (exporters.length > 0) return exporters[0];
        throw new Error('Missing default graph exporter for module \'' + this.getModule().getModuleName() + '\'');
    }

    //TODO: From AbstractModule(but not for experimental)
    getImageExporters() { return DEFAULT_IMAGE_EXPORTERS; }

    //TODO: From AbstractModule(but not for experimental)
    getGraphImporter() { return this._importer; }

    getGraphChangeHandler()
    {
        return this._graphChangeHandler;
    }

    applyAutoLayout()
    {
        //this.emit("userPreChangeLayout", this.getGraph());
        GraphLayout.applyLayout(this.getGraph());

        this.getModule().captureGraphEvent();
        //this.emit("userChangeLayout", this.getGraph());
        //this.emit("userPostChangeLayout", this.getGraph());
    }

    applyAutoRename()
    {
        const graphLabeler = this._labeler;
        const graph = this._graph;

        if (graph.isEmpty()) return;

        //Reset all default labels...
        for (const node of graph.getNodes())
        {
            if (!node.getNodeCustom()) node.setNodeLabel('');
        }

        //Rename all default labels appropriately...
        for (const node of graph.getNodes())
        {
            if (!node.getNodeCustom())
            {
                node.setNodeLabel(graphLabeler.getDefaultNodeLabel());
            }
        }
    }

    onGraphIntentImport()
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentCreateEdge(edge)
    {
    }

    onGraphIntentFinishEdge(edge)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentMoveEdge(edge, nextQuad, prevQuad)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentChangeDestination(edge, destinationNode, prevDestination, prevQuad)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentChangeInitial(nextInitial, prevInitial)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentMoveNode(node, nextX, nextY, prevX, prevY)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentMoveAllNodes(nodes, dx, dy)
    {
        this.getModule().captureGraphEvent();
    }

    onGraphIntentDeleteNodes(node, targetNodes, prevX, prevY)
    {
        if (this.shouldAutoLabel)
        {
            this.applyAutoRename();
        }
    }

    setAutoRenameNodes(enable)
    {
        this.shouldAutoLabel = enable;
    }

    shouldAutoRenameNodes()
    {
        return this.shouldAutoLabel;
    }

    renameNode(node, name)
    {
        node.setNodeLabel(name);
        node.setNodeCustom(true);

        this.getModule().captureGraphEvent();
        //this.emit("userRenameNode", this.getGraph(), node, name, prev, isPrevCustom);
    }

    createNode(x, y)
    {
        const newNodeLabel = this.getGraphLabeler().getDefaultNodeLabel();

        if (typeof x === 'undefined') x = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;
        if (typeof y === 'undefined') y = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;

        //this.emit("userPreCreateNode", this.getGraph(), newNodeLabel, x, y);

        const node = this.getGraph().createNode(x, y);
        node.setNodeLabel(newNodeLabel);

        //this.emit("userCreateNode", this.getGraph(), node);
        this.getModule().captureGraphEvent();
        //this.emit("userPostCreateNode", this.getGraph(), node);
        return node;
    }

    toggleNode(node)
    {
        const prev = node.getNodeAccept();
        const result = !prev;
        //Toggle accept for selected node
        node.setNodeAccept(result);

        //Emit event
        //this.emit("userToggleNode", this.getGraph(), node, prev);
        this.getModule().captureGraphEvent();
    }

    deleteSelectedNodes(selectedNode)
    {
        const picker = this.inputController.getPicker();
        const selection = picker.getSelection(this.getGraph()).slice();

        //this.emit("userPreDeleteNodes", this.getGraph(), selectedNode, selection, this.prevX, this.prevY);

        //Remove from graph
        for (const node of selection)
        {
            this.getGraph().deleteNode(node);
        }

        //Remove from selection
        picker.clearSelection();

        //Emit event
        this.onGraphIntentDeleteNodes(selectedNode, selection, this.prevX, this.prevY);
        this.getModule().captureGraphEvent();
        //this.emit("userDeleteNodes", this.getGraph(), selectedNode, selection, this.prevX, this.prevY);
        //this.emit("userPostDeleteNodes", this.getGraph(), selectedNode, selection, this.prevX, this.prevY);
    }

    deleteTargetNode(target)
    {
        //this.emit("userPreDeleteNodes", this.getGraph(), target, [target], this.prevX, this.prevY);

        this.getGraph().deleteNode(target);

        //Emit event
        this.onGraphIntentDeleteNodes(target, [target], this.prevX, this.prevY);
        this.getModule().captureGraphEvent();
        //this.emit("userDeleteNodes", this.getGraph(), target, [target], this.prevX, this.prevY);
        //this.emit("userPostDeleteNodes", this.getGraph(), target, [target], this.prevX, this.prevY);
    }

    deleteTargetNodes(targets)
    {
        if (!targets || targets.length <= 0) return;

        //this.emit("userPreDeleteNodes", this.getGraph(), targets[0], targets, this.prevX, this.prevY);

        const graph = this.getGraph();
        for (const node of targets)
        {
            graph.deleteNode(node);
        }

        //Emit event
        this.onGraphIntentDeleteNodes(targets[0], targets, this.prevX, this.prevY);
        this.getModule().captureGraphEvent();
        //this.emit("userDeleteNodes", this.getGraph(), targets[0], targets, this.prevX, this.prevY);
        //this.emit("userPostDeleteNodes", this.getGraph(), targets[0], targets, this.prevX, this.prevY);
    }

    deleteTargetEdge(target)
    {
        //this.emit("userPreDeleteEdge", this.getGraph(), target, this.prevEdgeTo, this.prevQuad);
        this.getGraph().deleteEdge(target);

        //Emit event
        this.getModule().captureGraphEvent();
        //this.emit("userDeleteEdge", this.getGraph(), target, this.prevEdgeTo, this.prevQuad);
        //this.emit("userPostDeleteEdge", this.getGraph(), target, this.prevEdgeTo, this.prevQuad);
    }

    deleteTargetEdges(targets)
    {
        if (!targets || targets.length <= 0) return;

        for (const target of targets)
        {
            this.deleteTargetEdge(target);
        }
    }

    moveNodeTo(pointer, node, x, y)
    {
        const nodeSize = node.getNodeSize();
        for (const other of this.getGraph().getNodes())
        {
            //Update node collision
            if (node === other) continue;

            const dx = x - other.x;
            const dy = y - other.y;
            const angle = Math.atan2(dy, dx);

            const diameter = (nodeSize * 2);
            const nextDX = other.x + (Math.cos(angle) * diameter) - x;
            const nextDY = other.y + (Math.sin(angle) * diameter) - y;

            if (dx * dx + dy * dy < nodeSize * nodeSize * 4)
            {
                x += nextDX;
                y += nextDY;
            }
        }

        node.x = x;
        node.y = y;
    }

    moveMultipleNodesTo(pointer, nodes, x, y)
    {
        //Moves all nodes by difference between initial position with passed-in x and y
        const pos = pointer.getInputEventPosition();
        const dx = x - pos.x;
        const dy = y - pos.y;
        for (const node of nodes)
        {
            node.x += dx;
            node.y += dy;
        }

        //Updates initial position to passed-in x and y to maintain relative position
        pointer.changeInputEventPosition(x, y);
    }

    moveEdgeTo(pointer, edge, x, y)
    {
        edge.setQuadraticByCoords(x, y);
    }

    moveEndpointTo(pointer, edge, x, y)
    {
        //Get ONLY node at x and y (cannot use hover target, since it is not ONLY nodes)
        const picker = this.inputController.getPicker();
        const dst = picker.getNodeAt(this.getGraph(), x, y) || pointer;

        edge.changeDestinationNode(dst);

        //If the cursor returns to the state after leaving it...
        if (edge.isSelfLoop())
        {
            //Make it a self loop
            const sourceNode = edge.getSourceNode();
            const dx = sourceNode.x - x;
            const dy = sourceNode.y - y;
            const radians = Math.atan2(dy, dx) + Math.PI;
            edge.setQuadratic(radians);
        }
        //Otherwise, maintain original curve
        else
        {
            //TODO: This also causes self-loops to act weird when no longer a self loop
            edge.setQuadratic(this.prevQuad.radians, this.prevQuad.length);
        }
    }

    openLabelEditor(target, x, y, placeholder = null, replace = true, callback = null)
    {
        if (!this.labelEditorElement)
        {
            if (callback) callback();
            return;
        }

        const prevLabel = placeholder || target.getEdgeLabel();
        this.labelEditorElement.openEditor(target, placeholder, replace, () => 
        {
            const label = target.getEdgeLabel();
            if (prevLabel.length > 0 && label != prevLabel)
            {
                this.getModule().captureGraphEvent();
                //this.emit("edgeLabel", this.getGraph(), target, label, prevLabel);
            }

            if (callback)
            {
                callback();
            }
        });
    }

    focusOnNode(node)
    {
        //Center workspace at focused node; inverted due to graph-to-screen space
        this.inputController.getInputAdapter().getViewportAdapter().setOffset(-node.x, -node.y);
    }

    focusOnEdge(edge)
    {
        //Center workspace at focused edge; inverted due to graph-to-screen space
        const center = edge.getCenterPoint();
        this.inputController.getInputAdapter().getViewportAdapter().setOffset(-center.x, -center.y);
    }

    focusOnNodes(nodes)
    {
        //Center workspace at the average of focused nodes; inverted due to graph-to-screen space
        const length = nodes.length;
        let ax = 0;
        let ay = 0;
        for (const node of nodes)
        {
            ax += node.x;
            ay += node.y;
        }
        this.inputController.getInputAdapter().getViewportAdapter().setOffset(-ax / length, -ay / length);
    }
}
//Mixin Eventable
Eventable.mixin(GraphController);

/*
function moveNodesOutOfEdges(target, graph)
{
    const x1 = target.getSourceNode().x;
    const y1 = target.getSourceNode().y;
    const x2 = target.getDestinationNode().x;
    const y2 = target.getDestinationNode().y;
    const dist12sq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    let vertical = false;
    let m = 0;
    let b = 0;
    if (x1 > x2) 
    {
        m = (y1 - y2) / (x1 - x2);
        b = y2 - m * x2;
    }
    else if (x1 < x2) 
    {
        m = (y2 - y1) / (x2 - x1);
        b = y1 - m * x1;
    }
    else 
    {
        vertical = true;
    }

    for (const node of graph.getNodes())
    {
        if (node === target.getSourceNode() || node === target.getDestinationNode()) continue;

        const nodeSize = node.getNodeSize();
        const x0 = node.x;
        const y0 = node.y;

        const dist01sq = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
        const dist02sq = (x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0);
        if (dist01sq > dist12sq || dist02sq > dist12sq) continue;


        let dist = 0;
        let xint = 0;
        let yint = 0;
        let m0 = 0;
        let horizontal = false;
        if (vertical) 
        {
            dist = Math.abs(x1 - x0);
            xint = x1;
            yint = y0;
            m0 = 0;
        }
        else 
        {
            dist = Math.abs(b + m * x0 - y0) / Math.sqrt(1 + m * m);
            xint = (x0 + m * y0 - m * b) / (m * m + 1);
            yint = m * xint + b;
            if (m !== 0) 
            {
                m0 = 1 / m;
            }
            else 
            {
                horizontal = true;
            }
        }

        if (dist < nodeSize) 
        {
            const toMove = nodeSize - dist + 10;
            const distx = x0 - xint;
            const disty = y0 - yint;
            let signx = -1;
            let signy = -1;
            if (distx > 0) signx = 1;
            if (disty > 0) signy = 1;

            if (horizontal) 
            {
                node.y = y0 + signy * toMove;
            }
            else 
            {
                let toMovex = toMove / Math.sqrt(m0 * m0 + 1);
                let toMovey = Math.abs(m0) * toMovex;
                node.x = x0 + signx * toMovex;
                node.y = y0 + signy * toMovey;
            }
        }
    }
}
*/

export default GraphController;
