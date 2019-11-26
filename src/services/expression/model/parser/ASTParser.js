import AbstractParser from '@flapjs/util/loader/AbstractParser.js';
import SemanticVersion from '@flapjs/util/SemanticVersion.js';

import AST from '../AST.js';
import * as ASTUtils from '../util/ASTUtils.js';

export const VERSION_STRING = '1.0.0';
export const VERSION = SemanticVersion.parse(VERSION_STRING);

/**
 * A class that parses and composes AST's to and from JSON data.
 */
class ASTParser extends AbstractParser
{
    constructor()
    {
        super();
    }

    /**
     * @override
     * @param  {object} data         	    The ast data to parse.
     * @param  {AbstractNode} [dst=null]	The target to set parsed ast data.
     * @returns {AbstractNode}              The result in the passed-in dst.
     */
    parse(data, dst = null)
    {
        if (typeof data !== 'object')
        {
            throw new Error('Unable to parse data of non-object type');
        }

        const dataVersion = SemanticVersion.parse(data['_version'] || '0.0.0');
        if (!dataVersion.canSupportVersion(VERSION))
        {
            throw new Error('Unable to parse data for incompatible version \'' + dataVersion + '\'');
        }

        const astData = data['ast'] || [];
        let objectMapping = astData['objectMapping'];
        let rootIndex = astData['rootIndex'];

        let nodeMapping = new Map();

        // Identify all objects and convert them to AST node instances (without children)...
        for(let key of Object.keys(nodeMapping))
        {
            let astObject = objectMapping[key];
            let typeClass = getClassForASTObjectType(astObject.type);
            let typeClassArgs = getClassArgsForASTObject(astObject);
            let astNode = new (typeClass)(astObject.symbol, key, ...typeClassArgs);
            nodeMapping.set(key, astNode);
        }

        // Hydrate those objects with children!!!
        for(let key of Object.keys(nodeMapping))
        {
            let astObject = objectMapping[key];
            let astNode = nodeMapping.get(key);
            if (Array.isArray(astObject.children) && astObject.children.length > 0)
            {
                for(let childIndex of astObject.children)
                {
                    let childNode = nodeMapping.get(childIndex);
                    astNode.addChild(childNode);
                }
            }
        }

        dst = nodeMapping.get(rootIndex);
        return dst;
    }

    /**
     * @override
     * @param {AbstractNode} target     The root ast node to compose into data.
     * @param {object} [dst={}]         The object to append graph data.
     * @returns {object}                The result in the passed-in dst.
     */
    compose(target, dst = {})
    {
        let objectIndexMapping = {};

        // Identify all nodes and convert them to objects (without children)...
        ASTUtils.forEach(target, astNode =>
            objectIndexMapping[astNode.getIndex()] = objectifyASTWithoutChildren(astNode)
        );

        // Hydrate those objects with children!!!
        ASTUtils.forEach(target, astNode =>
        {
            let astObjectIndex = astNode.getIndex();
            let astObject = objectIndexMapping[astObjectIndex];
            if (astNode.hasChildren())
            {
                for(let child of astNode.getChildren())
                {
                    let astChildIndex = child.getIndex();
                    let astChild = objectIndexMapping[astChildIndex];
                    astChild.parent = astObjectIndex;
                    astObject.children.push(astChildIndex);
                }
            }
        });

        dst['_version'] = VERSION_STRING;
        dst['ast'] = {
            objectMapping: objectIndexMapping,
            rootIndex: target ? target.getIndex() : -1,
        };

        return dst;
    }
}

function objectifyASTWithoutChildren(astNode)
{
    return {
        type: getASTNodeType(astNode),
        index: astNode.getIndex(),
        symbol: astNode.getSymbol(),
        parent: -1,
        children: []
    };
}

function getClassArgsForASTObject(astObject)
{
    switch(astObject.type)
    {
        case 'op':
            if (Array.isArray(astObject.children))
            {
                return [ astObject.children.length ];
            }
            else
            {
                return [];
            }
        default: return [];
    }
}

function getClassForASTObjectType(type)
{
    switch(type)
    {
        case 'terminal': return AST.Terminal;
        case 'unary': return AST.Unary;
        case 'binary': return AST.Binary;
        case 'scope': return AST.Scope;
        case 'op': return AST.Op;
        default:
            throw new Error(`Unknown AST node type '${type}'.`);
    }
}

function getASTNodeType(astNode)
{
    if (astNode instanceof AST.Terminal)
    {
        return 'terminal';
    }
    else if (astNode instanceof AST.Unary)
    {
        return 'unary';
    }
    else if (astNode instanceof AST.Binary)
    {
        return 'binary';
    }
    else if (astNode instanceof AST.Scope)
    {
        return 'scope';
    }
    else if (astNode instanceof AST.Op)
    {
        return 'op';
    }
    else
    {
        throw new Error(`Missing AST node type for class '${astNode.constructor.name}'.`);
    }
}

export const INSTANCE = new ASTParser();
export default ASTParser;
