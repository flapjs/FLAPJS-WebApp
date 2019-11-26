import AbstractParser from '@flapjs/util/loader/AbstractParser.js';
import FSAGraph from '../graph/FSAGraph.js';
import { SYMBOL_SEPARATOR } from '../graph/elements/FSAEdge.js';

export const VERSION = '1.0.0';

/**
 * A class that parses and composes an FSAGraph into JFLAP-supported XML data. This is usually used with
 * an exporter to save to a .jff file to actually import into JFLAP.
 */
class JFFGraphParser extends AbstractParser
{
    constructor() { super(); }

    /**
     * @override
     * @param  {object} data          The graph data to parse.
     * @param  {FSAGraph} [dst=null]  The target to set parsed graph data.
     * @returns {FSAGraph}            The result in the passed-in dst.
     */
    parse(data, dst = null)
    {
        if (!dst)
        {
            dst = new FSAGraph();
        }
        else
        {
            dst.clear();
        }

        if (typeof data !== 'object')
        {
            throw new Error('Unable to parse data of non-object type');
        }

        // const version = data['_version'] || '0.0.0';
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
    }

    /**
     * @override
     * @param  {FSAGraph} target      The graph to compose into data.
     * @param  {Document} [dst=null]  The document to append graph data.
     * @returns {Document}            The result in the passed-in dst.
     */
    compose(target, dst = null)
    {
        if (!(target instanceof FSAGraph))
        {
            throw new Error('Unable to compose target of unknown type');
        }

        if (!dst)
        {
            const header = '<?xml version="1.0" encoding="UTF-8" ' +
                'standalone="no"?><!--Created with flap.js ' + VERSION + '-->';
            const parser = new DOMParser();
            dst = parser.parseFromString(header, 'application/xml');
        }

        const root = dst.createElement('structure');

        const graphNodes = target.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = target.getEdges() || [];
        // const edgeCount = graphEdges.length || 0;
        const graphInitial = target.getStartNode();

        const type = dst.createElement('type');
        type.innerHTML = 'fa'; //finite automata
        root.appendChild(type);

        const automaton = dst.createElement('automaton');
        root.appendChild(automaton);

        const nodeIndices = new Map();
        for (let i = 0; i < nodeCount; ++i)
        {
            const node = graphNodes[i];
            nodeIndices.set(node, i);

            //state tag
            const state = dst.createElement('state');
            state.id = '' + i;
            state.setAttribute('name', node.getNodeLabel());
            automaton.appendChild(state);

            //x tag
            const x = dst.createElement('x');
            x.innerHTML = '' + (node.x || 0);
            state.appendChild(x);

            //y tag
            const y = dst.createElement('y');
            y.innerHTML = '' + (node.y || 0);
            state.appendChild(y);

            //initial tag
            if (graphInitial === node)
            {
                state.appendChild(dst.createElement('initial'));
            }

            //final tag
            if (node.getNodeAccept())
            {
                state.appendChild(dst.createElement('final'));
            }
        }

        for (let edge of graphEdges)
        {
            const symbols = edge.getEdgeLabel().split(SYMBOL_SEPARATOR);
            for (let symbol of symbols)
            {
                //transition tag
                const transition = dst.createElement('transition');
                automaton.appendChild(transition);

                //from tag
                const from = dst.createElement('from');
                from.innerHTML = '' + (nodeIndices.get(edge.getEdgeFrom()) || 0);
                transition.appendChild(from);

                //to tag
                const to = dst.createElement('to');
                to.innerHTML = '' + (nodeIndices.get(edge.getEdgeTo()) || 0);
                transition.appendChild(to);

                //read tag
                const read = dst.createElement('read');
                read.innerHTML = '' + (symbol || '');
                transition.appendChild(read);
            }
        }

        return dst;
    }
}

export const INSTANCE = new JFFGraphParser();
export default JFFGraphParser;
