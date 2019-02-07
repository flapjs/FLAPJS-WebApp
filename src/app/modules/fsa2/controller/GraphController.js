import AbstractGraphController from 'modules/abstract/AbstractGraphController.js';

import Eventable from 'util/Eventable.js';
import GraphEdge from 'graph/GraphEdge.js';
import GraphLayout from 'modules/fsa/graph/GraphLayout.js';
import FSAGraph from 'modules/fsa/graph/FSAGraph.js';
import FSAGraphLabeler from 'modules/fsa/graph/FSAGraphLabeler.js';
import * as FSAGraphParser from 'modules/fsa/graph/FSAGraphParser.js';

import GraphChangeHandler from 'experimental/GraphChangeHandler.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';

const EXPORTERS = [
  new FSAGraphExporter(),
  new JFLAPGraphExporter()
];

const NODE_SPAWN_RADIUS = 64;
const DEFAULT_AUTO_RENAME = true;
const GRAPH_REFRESH_RATE = 30;
const DELETE_ON_EMPTY = true;

class GraphController extends AbstractGraphController
{
  constructor(module)
  {
    super(module, new FSAGraph(), new FSAGraphLabeler(), FSAGraphParser);

    this.inputController = null;
    this.machineController = null;
    this._graphChangeHandler = new GraphChangeHandler(GRAPH_REFRESH_RATE);

    this.getGraphLabeler().setGraphController(this);

    this.labelEditorElement = null;

    this.prevQuad = {
      radians: 0, length: 0,
      x: 0, y: 0
    };
    this.prevEdgeTo = null;
    this.prevX = 0;
    this.prevY = 0;

    this.shouldAutoLabel = DEFAULT_AUTO_RENAME;

    //The difference between controller events vs graph events is: controller has user-intent

    //tryCreateWhileTrash()
    this.registerEvent("tryCreateWhileTrash");
  }

  //Override
  initialize(module)
  {
    super.initialize(module);

    this.inputController = module.getInputController();
    this.machineController = module.getMachineController();
  }

  //Override
  destroy(module)
  {
    super.destroy(module);
  }

  //Override
  update(module)
  {
    super.update(module);

    this._graphChangeHandler.update(this._graph);
  }

  //Override
  getGraphExporters() { return EXPORTERS; }

  getGraphChangeHandler()
  {
    return this._graphChangeHandler;
  }

  applyAutoLayout()
  {
    GraphLayout.applyLayout(this.getGraph());

    this.getModule().captureGraphEvent();
  }

  applyAutoRename()
  {
    const graphLabeler = this._labeler;
    const graph = this._graph;

    if (graph.isEmpty()) return;

    //Reset all default labels...
    for(const node of graph.getNodes())
    {
      if (!node.getNodeCustom()) node.setNodeLabel("");
    }

    //Rename all default labels appropriately...
    for(const node of graph.getNodes())
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
    const prev = this.shouldAutoLabel;
    this.shouldAutoLabel = enable;
    if (enable && !prev)
    {
      this.applyAutoRename();
    }
  }

  shouldAutoRenameNodes()
  {
    return this.shouldAutoLabel;
  }

  renameNode(node, name)
  {
    const prev = node.getNodeLabel();
    const isPrevCustom = node.getNodeCustom();

    node.setNodeLabel(name);
    node.setNodeCustom(true);

    this.getModule().captureGraphEvent();
  }

  createNode(x, y)
  {
    if (typeof x === 'undefined') x = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;
    if (typeof y === 'undefined') y = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;

    const node = this.getGraph().createNode(x, y);

    const newNodeLabel = this.getGraphLabeler().getDefaultNodeLabel();
    node.setNodeLabel(newNodeLabel);

    this.getModule().captureGraphEvent();
    return node;
  }

  toggleNode(node)
  {
    const prev = node.getNodeAccept();
    const result = !prev;
    //Toggle accept for selected node
    node.setNodeAccept(result);

    //Emit event
    this.getModule().captureGraphEvent();
  }

  deleteSelectedNodes(selectedNode)
  {
    const picker = this.inputController.getPicker();
    const selection = picker.getSelection(this.getGraph()).slice();

    //Remove from graph
    for(const node of selection)
    {
      this.getGraph().deleteNode(node);
    }

    //Remove from selection
    picker.clearSelection();

    //Emit event
    this.onGraphIntentDeleteNodes(selectedNode, selection, this.prevX, this.prevY);
    this.getModule().captureGraphEvent();
  }

  deleteTargetNode(target)
  {
    this.getGraph().deleteNode(target);

    //Emit event
    this.onGraphIntentDeleteNodes(target, [target], this.prevX, this.prevY);
    this.getModule().captureGraphEvent();
  }

  deleteTargetNodes(targets)
  {
    if (!targets || targets.length <= 0) return;

    const graph = this.getGraph();
    for(const node of targets)
    {
      graph.deleteNode(node);
    }

    //Emit event
    this.onGraphIntentDeleteNodes(targets[0], targets, this.prevX, this.prevY);
    this.getModule().captureGraphEvent();
  }

  deleteTargetEdge(target)
  {
    this.getGraph().deleteEdge(target);

    //Emit event
    this.getModule().captureGraphEvent();
  }

  deleteTargetEdges(targets)
  {
    if (!targets || targets.length <= 0) return;

    for(const target of targets)
    {
      this.deleteTargetEdge(target);
    }
  }

  moveNodeTo(pointer, node, x, y)
  {
    const nodeSize = node.getNodeSize();
    for(const other of this.getGraph().getNodes())
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
    for(const node of nodes)
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

  openLabelEditor(target, defaultValue=null, callback=null)
  {
    const labelEditor = this.getModule().getApp().getLabelEditorComponent();
    const prevLabel = defaultValue;
    labelEditor.openEditor(target, defaultValue, (target, value) => {
      if (DELETE_ON_EMPTY && (!value || value.length <= 0) && target instanceof GraphEdge)
      {
        //Assumes target is GraphEdge
        this._graph.deleteEdge(target);
      }
      else
      {
        if (target instanceof GraphEdge)
        {
          target.setEdgeLabel(value);
        }
        else
        {
          target.setNodeLabel(value);
        }

        if (!prevLabel || (prevLabel.length > 0 && value !== prevLabel))
        {
          this.getModule().captureGraphEvent();
        }
        if (callback) callback(target, value);
      }
    }, (target) => {
      if (DELETE_ON_EMPTY && (!prevLabel || prevLabel.length <= 0) && target instanceof GraphEdge)
      {
        //Assumes target is GraphEdge
        this._graph.deleteEdge(target);
      }
    });
  }

  focusOnNode(node)
  {
    //Center workspace at focused node; inverted due to graph-to-screen space
    this.inputController.getInputAdapter().getViewport().setOffset(-node.x, -node.y);
  }

  focusOnEdge(edge)
  {
    //Center workspace at focused edge; inverted due to graph-to-screen space
    const center = edge.getCenterPoint();
    this.inputController.getInputAdapter().getViewport().setOffset(-center.x, -center.y);
  }

  focusOnNodes(nodes)
  {
    //Center workspace at the average of focused nodes; inverted due to graph-to-screen space
    const length = nodes.length;
    let ax = 0;
    let ay = 0;
    for(const node of nodes)
    {
      ax += node.x;
      ay += node.y;
    }
    this.inputController.getInputAdapter().getViewport().setOffset(-ax / length, -ay / length);
  }
}
//Mixin Eventable
Eventable.mixin(GraphController);

export default GraphController;
