import FSAGraph from './graph/FSAGraph.js';
import { SYMBOL_SEPARATOR } from './graph/element/FSAEdge.js';

const GRAPH_PARSER_VERSION = '1.0.0';

export const JSON = {
    parse(data, dst = null)
    {
        if (!dst) dst = new FSAGraph();
        else dst.clear();

        const nodeDatas = data['nodes'] || [];
        const nodeCount = Math.min(nodeDatas.length || 0, data['nodeCount'] || 0);
        const edgeDatas = data['edges'] || [];
        const edgeCount = Math.min(edgeDatas.length || 0, data['edgeCount'] || 0);
        const initialIndex = data['initial'] || 0;

        const nodeIndices = new Map();
        for (let i = 0; i < nodeCount; ++i)
        {
            const nodeData = nodeDatas[i];
            if (!nodeData) continue;

            //NOTE: Assumes createNode will maintain order
            const node = dst.createNode(nodeData['x'] || 0, nodeData['y'] || 0, nodeData['id']);
            node.setNodeLabel(nodeData['label'] || '');
            node.setNodeAccept(nodeData['accept'] || false);
            node.setNodeCustom(nodeData['custom'] || false);

            nodeIndices.set(i, node);
        }

        const initialNode = nodeIndices.get(initialIndex);
        if (initialNode)
        {
            dst.setStartNode(initialNode);
        }

        for (let i = 0; i < edgeCount; ++i)
        {
            const edgeData = edgeDatas[i];
            if (!edgeData) continue;
            const sourceNode = nodeIndices.get(edgeData['from']) || null;
            //Cannot create source-less edges
            if (!sourceNode) continue;
            const destinationNode = nodeIndices.get(edgeData['to']) || null;
            //NOTE: Assumes createEdge will maintain order
            const edge = dst.createEdge(sourceNode, destinationNode, edgeData['id']);
            const quadData = edgeData['quad'] || {};
            edge.setEdgeLabel(edgeData['label'] || '');
            edge.setQuadraticRadians(quadData['radians'] || 0);
            edge.setQuadraticLength(quadData['length'] || 0);
        }

        return dst;
    },
    objectify(graph)
    {
        const graphNodes = graph.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = graph.getEdges() || [];
        const edgeCount = graphEdges.length || 0;
        const graphInitial = graph.getStartNode();

        const nodeDatas = new Array(nodeCount);
        const nodeIndices = new Map();
        for (let i = 0; i < nodeCount; ++i)
        {
            const node = graphNodes[i];
            if (node)
            {
                //NOTE: Assumes node must have an id
                const elementID = node.getGraphElementID();

                nodeIndices.set(node, i);
                nodeDatas[i] = {
                    id: elementID,
                    x: node.x || 0, y: node.y || 0,
                    label: node.getNodeLabel() || '',
                    accept: node.getNodeAccept() || false,
                    custom: node.getNodeCustom() || false
                };
            }
        }

        const edgeDatas = new Array(edgeCount);
        for (let i = 0; i < edgeCount; ++i)
        {
            const edge = graphEdges[i];
            if (edge)
            {
                //NOTE: Assumes edge must have an id
                const elementID = edge.getGraphElementID();

                const quad = edge.getQuadratic() || {};
                const edgeSource = edge.getEdgeFrom();
                const edgeDestination = edge.getEdgeTo();
                const sourceIndex = nodeIndices.has(edgeSource) ? nodeIndices.get(edgeSource) : -1;
                const destinationIndex = nodeIndices.has(edgeDestination) ? nodeIndices.get(edgeDestination) : -1;
                edgeDatas[i] = {
                    id: elementID,
                    from: sourceIndex,
                    to: destinationIndex,
                    quad: { radians: quad['radians'] || 0, length: quad['length'] || 0 },
                    label: edge.getEdgeLabel() || ''
                };
            }
        }

        const initialIndex = nodeIndices.get(graphInitial) || 0;

        return {
            nodeCount: nodeCount,
            nodes: nodeDatas,
            edgeCount: edgeCount,
            edges: edgeDatas,
            initial: initialIndex,
            _version: GRAPH_PARSER_VERSION
        };
    }
};

export const XML = {
    parse(data, dst = null)
    {
        if (!dst) dst = new FSAGraph();
        else dst.clear();

        const nodeElements = data.getElementsByTagName('state') || [];
        const nodeCount = nodeElements.length;
        const edgeElements = data.getElementsByTagName('transition') || [];
        const edgeCount = edgeElements.length;
        let initialIndex = '0';

        //Get the nodes...
        const nodeElementIDs = new Map();
        for (let i = 0; i < nodeCount; ++i)
        {
            const nodeElement = nodeElements[i];
            if (!nodeElement) continue;
            const nodeElementID = nodeElement.getAttribute('id');
            if (!nodeElementID) continue;

            //Get x value
            let x = 0;
            const xElements = nodeElement.getElementsByTagName('x');
            //If no elements exists, we are guaranteed an empty list...
            if (xElements.length > 0)
            {
                const xElement = xElements[0];
                if (xElement.hasChildNodes())
                {
                    //hasChildNodes() guarantees at least 1 element
                    const xValue = xElement.childNodes[0];
                    if (xValue)
                    {
                        try
                        {
                            x = parseFloat(xValue.nodeValue) || 0;
                        }
                        catch (e)
                        {
                            x = 0;
                        }
                    }
                }
            }

            //Get y value
            let y = 0;
            const yElements = nodeElement.getElementsByTagName('y');
            //If no elements exists, we are guaranteed an empty list...
            if (yElements.length > 0)
            {
                const yElement = yElements[0];
                if (yElement.hasChildNodes())
                {
                    //hasChildNodes() guarantees at least 1 element
                    const yValue = yElement.childNodes[0];
                    if (yValue)
                    {
                        try
                        {
                            y = parseFloat(yValue.nodeValue) || 0;
                        }
                        catch (e)
                        {
                            y = 0;
                        }
                    }
                }
            }

            //Get initial flag
            const initialElements = nodeElement.getElementsByTagName('initial');
            //If no elements exists, we are guaranteed an empty list...
            const initial = initialElements.length > 0;

            //Get final flag
            const finalElements = nodeElement.getElementsByTagName('final');
            //If no elements exists, we are guaranteed an empty list...
            const final = finalElements.length > 0;

            //NOTE: Assumes createNode will maintain order
            const node = dst.createNode(x, y);
            node.setNodeLabel(nodeElement.getAttribute('name') || '');
            node.setNodeAccept(final);

            if (initial) initialIndex = nodeElementID;
            nodeElementIDs.set(nodeElementID, node);
        }

        //Set the initial node...
        const initialNode = nodeElementIDs.get(initialIndex);
        if (initialNode)
        {
            dst.setStartNode(initialNode);
        }

        //Readjust the center of graph...
        const boundingRect = dst.getBoundingRect();
        const minX = boundingRect.minX;
        const minY = boundingRect.minY;
        const width = boundingRect.width;
        const height = boundingRect.height;
        const graphNodes = dst.getNodes();
        for (let i = 0, len = graphNodes.length; i < len; ++i)
        {
            graphNodes[i].x -= minX + width / 2;
            graphNodes[i].y -= minY + height / 2;
        }

        //Get the transitions...
        const transitionMapping = new Map();
        for (let i = 0; i < edgeCount; ++i)
        {
            const edgeElement = edgeElements[i];
            if (!edgeElement) continue;

            //Get from value
            let sourceID = null;
            const fromElements = edgeElement.getElementsByTagName('from');
            //If no elements exists, we are guaranteed an empty list...
            if (fromElements.length > 0)
            {
                const fromElement = fromElements[0];
                if (fromElement.hasChildNodes())
                {
                    //hasChildNodes() guarantees at least 1 element
                    const fromValue = fromElement.childNodes[0];
                    if (fromValue)
                    {
                        sourceID = fromValue.nodeValue;
                    }
                }
            }

            //Cannot create source-less edges
            if (!nodeElementIDs.has(sourceID)) continue;

            //Get to value
            let destinationID = '';
            const toElements = edgeElement.getElementsByTagName('to');
            //If no elements exists, we are guaranteed an empty list...
            if (toElements.length > 0)
            {
                const toElement = toElements[0];
                if (toElement.hasChildNodes())
                {
                    //hasChildNodes() guarantees at least 1 element
                    const toValue = toElement.childNodes[0];
                    if (toValue)
                    {
                        destinationID = toValue.nodeValue || '';
                    }
                }
            }

            //Get read value
            let symbol = '';
            const readElements = edgeElement.getElementsByTagName('read');
            //If no elements exists, we are guaranteed an empty list...
            if (readElements.length > 0)
            {
                const readElement = readElements[0];
                if (readElement.hasChildNodes())
                {
                    //hasChildNodes() guarantees at least 1 element
                    const readValue = readElement.childNodes[0];
                    if (readValue)
                    {
                        symbol = readValue.nodeValue || '';
                    }
                }
            }

            const transitionID = sourceID + '\n' + destinationID;
            let symbols;
            if (transitionMapping.has(transitionID))
            {
                symbols = transitionMapping.get(transitionID);
            }
            else
            {
                symbols = [];
                transitionMapping.set(transitionID, symbols);
            }
            symbols.push(symbol);
        }

        for (const transitionKey of transitionMapping.keys())
        {
            const key = transitionKey.split('\n');
            if (key.length !== 2) continue;

            const symbols = transitionMapping.get(transitionKey);
            const label = symbols.join(SYMBOL_SEPARATOR);
            //Should never be null, since it was checked before...
            const sourceNode = nodeElementIDs.get(key[0]);
            const destinationNode = nodeElementIDs.get(key[1]);

            //NOTE: Assumes createEdge will maintain order
            const edge = dst.createEdge(sourceNode, destinationNode);
            edge.setEdgeLabel(label);
        }

        return dst;
    },
    objectify(graph)
    {
        const graphNodes = graph.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = graph.getEdges() || [];
        // const edgeCount = graphEdges.length || 0;
        const graphInitial = graph.getStartNode();

        const header = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
            '<!--Created with flap.js ' + GRAPH_PARSER_VERSION + '-->' +
            '<structure></structure>';
        const parser = new DOMParser();
        const doc = parser.parseFromString(header, 'application/xml');
        const structure = doc.getElementsByTagName('structure')[0];

        const type = doc.createElement('type');
        type.innerHTML = 'fa'; //finite automata
        structure.appendChild(type);

        const automaton = doc.createElement('automaton');
        structure.appendChild(automaton);

        const nodeIndices = new Map();
        for (let i = 0; i < nodeCount; ++i)
        {
            const node = graphNodes[i];
            nodeIndices.set(node, i);

            //state tag
            const state = doc.createElement('state');
            state.id = '' + i;
            state.setAttribute('name', node.getNodeLabel());
            automaton.appendChild(state);

            //x tag
            const x = doc.createElement('x');
            x.innerHTML = '' + (node.x || 0);
            state.appendChild(x);

            //y tag
            const y = doc.createElement('y');
            y.innerHTML = '' + (node.y || 0);
            state.appendChild(y);

            //initial tag
            if (graphInitial === node)
            {
                state.appendChild(doc.createElement('initial'));
            }

            //final tag
            if (node.getNodeAccept())
            {
                state.appendChild(doc.createElement('final'));
            }
        }

        for (let edge of graphEdges)
        {
            const symbols = edge.getEdgeLabel().split(SYMBOL_SEPARATOR);
            for (let symbol of symbols)
            {
                //transition tag
                const transition = doc.createElement('transition');
                automaton.appendChild(transition);

                //from tag
                const from = doc.createElement('from');
                from.innerHTML = '' + (nodeIndices.get(edge.getEdgeFrom()) || 0);
                transition.appendChild(from);

                //to tag
                const to = doc.createElement('to');
                to.innerHTML = '' + (nodeIndices.get(edge.getEdgeTo()) || 0);
                transition.appendChild(to);

                //read tag
                const read = doc.createElement('read');
                read.innerHTML = '' + (symbol || '');
                transition.appendChild(read);
            }
        }

        return doc;
    }
};
